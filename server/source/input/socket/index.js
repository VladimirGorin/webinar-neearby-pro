const WebSocket = require('ws');

module.exports = class SocketServer {
    constructor(mysql, checkUserToken) {
        this._s = null
        this._port = 9000
        this.connections = new Map()
        this.blocked = []
        this.checkUserToken = checkUserToken
        this._mysql = mysql
        this._rooms = {} // _rooms[0] : live webinar, _rooms[1] : auto webinar
        // this._roomDatas = {} // _roomDatas[0: live, 1: live][room_id]{ playTime, users, winner }
        this._rooms[0] = {}
        this._rooms[1] = {}
        this._editRooms = {}
        this._editRooms[0] = {}
        this._editRooms[1] = {}
        // this._roomDatas[0] = {}
        // this._roomDatas[1] = {}
        this.winner = 0
        this.userCount = 0
        this.autowebinarUserCount = {}
        this.autowebinarRoomData = {}
        this.roomState = {}
        this.events = {}
        this.result = {}
        this.updateRoomStateFlag = {}
    }

    create() {
        this._s = new WebSocket.Server({port: this._port});

        this._s.on('connection', this.onConnect.bind(this));

        this.updateRoomInfo()        

        console.log(`SocketServer started on port ${this._port}`)
    }

    ping(connection) {
        connection.send(JSON.stringify({
            action: "ping"
        }));
    }

    onConnect(connection, req) {
        const ip = req.headers['x-forwarded-for'] || connection._socket.remoteAddress
        const address = ip + "_" + Math.random()
        this.connections.set(address, {
            connection,
            user: null,
            req,
        })
        this.ping(connection)

        connection.on('message', async (message) => {
            await this.command(address, JSON.parse(message))
        })

        connection.on('close', () => {
            this.winner -= 1
            this.userCount -= 1
            this.connections.delete(address)
        })
    }

    updateRoomInfo() {
        setInterval(() => {
            for (const roomType in this._rooms) {
                for (const i in this._rooms[roomType]) {
                    const roomItem = this._rooms[roomType][i]
                    if (this.userCount < 0) {
                        this.userCount = 0
                    }
                    this.userUpdate(roomType, this.userCount, i)
                    if (this.autowebinarRoomData.hasOwnProperty(i)) {
                        if (this.roomState[i] == 0) {
                            this.autowebinarUserCount[i] = this.getRandomArbitrary((this.autowebinarRoomData[i]['viewersQuantityStart'] - this.autowebinarRoomData[i]['viewersQuantityStart']/10), (this.autowebinarRoomData[i]['viewersQuantityStart'] + 10)) 
                        } else if (this.roomState[i] == 1) {
                            this.autowebinarUserCount[i] = this.getRandomArbitrary((this.autowebinarRoomData[i]['viewersQuantityMiddle'] - this.autowebinarRoomData[i]['viewersQuantityMiddle']/10), (this.autowebinarRoomData[i]['viewersQuantityMiddle'] + 10)) 
                        } else if (this.roomState[i] == -1) {
                            this.autowebinarUserCount[i] = this.getRandomArbitrary((this.autowebinarRoomData[i]['viewersQuantityEnd'] - this.autowebinarRoomData[i]['viewersQuantityEnd']/10), (this.autowebinarRoomData[i]['viewersQuantityEnd'] + 10)) 
                        }
                    }
                    for (let j = 0; j < roomItem.length; j++) {
                        const address = roomItem[j]
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
                            if (roomType === '0') {
                                connect.connection.send(JSON.stringify({
                                    action: "updateInfo",
                                    data: {
                                        users: this.userCount
                                    }
                                }))
                            } else {
                                if (this.autowebinarRoomData.hasOwnProperty(i)) {
                                    connect.connection.send(JSON.stringify({
                                        action: "updateInfo",
                                        data: {
                                            users: this.autowebinarUserCount[i]
                                        }
                                    }))
                                }
                            }

                        } else {
                            roomItem.splice(j, 1);
                        }
                        
                    }
                }
            }
        }, 2_000)
    }

    getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    async userUpdate(roomType, count, id) {
        const res = await this._mysql.execute(`
            UPDATE ${(roomType == 1) ? 'broadcast': 'webinar'} 
            SET userCount = ${count}
            WHERE id = ${id}
        `)
    }

    async command(address, command) {
        const isAutowebinar = command.data.isAutowebinar
        let connect = this.connections.get(address)
        if (command.action == "auth") {
            connect.user = command.data
            this.winner++
            if (!command.data.isAutowebinar) {
                this.userCount += 1
            } else {
                const index = command.data.chat + '-' + command.data.roomNumber
                this.autowebinarRoomData[index] = command.data.roomData      
                if (!this.roomState.hasOwnProperty(index)) {
                    this.roomState[index] = command.data.state
                }
            }
            if (!connect?.user?.type) {
                return false

            }

            if (connect.user.type == 'token') {
                // connect.user.auth = await this.checkUserToken(connect.user.data)
                connect.user.auth = await this.checkUserToken(connect.user.authData)
                    .catch(e => {
                        return false
                    })

            } else if (connect.user.type == 'ghoste') {
                    // this.winner = 1 + this.winner
                if (connect.user.login.includes('победитель')) {
                    connect.user.login = connect.user.login + this.winner
                } else if (connect.user.login.includes('editUser')) {
                    connect.user.login = connect.user.login + this.winner
                }
                connect.user.auth = {
                    id: 0,
                    login: connect.user.login,
                    name: connect.user.login,
                    // nameGhoste: connect.user.data // connect.user.data "auth":{"id":4,"login":"admin"}
                }
            }
            connect.user.ip = connect.req.headers['x-forwarded-for'] || connect.connection._socket.remoteAddress
            connect.connection.send(JSON.stringify({
                action: "authed",
                data: {
                    users: this.winner
                }
            }))
            return
        }

        if (command.action == "updateAutowebinarRoomState") {
            if (!connect.user) {
                return
            }
            const index = command.data.chat + '-' + command.data.roomNumber
            if (this.roomState.hasOwnProperty(index)) {
                console.log(this.roomState)
                if (this.roomState[index] != command.data.updateState) {
                    this.roomState[index] = command.data.updateState
                    console.log(command.data.updateState)
                    console.log(this.roomState)
                    const broadcastId = command.data.chat
                    let res = null
                    let eventList = []
                    let timeList = []
                    const ct = Date.now()
                    try {
                        res = await this._mysql.execute(`
                            SELECT logId, broadcastId, (${ct} + timeshift) as timestamp, username as login, message, 
                                    ${isAutowebinar} as isAutowebinar, 'ghoste' as type, 'eyJhbGciOiJI' as authData,
                                    'chat' as chat, 'mozilla/5.0 (windows nt 10.0; win64; x64)' as device,
                                    concat('{"id":8,"login":"', username, '"}') as auth, '::1' as ip , actionType, data, note
                            FROM event_log 
                            WHERE broadcastId = ${broadcastId}
                            ORDER BY timeshift 
                            `)
                    } catch (error) {
                        console.log("error", error)
                    }
                    if (res !== null) {
                        this.events[index] = []
                        this.result[index] = res[0]
                        const tempData = res[0]
                        let delay = 0
                        let beforTime = ct
                        for (let i = 0; i < tempData.length; i++) {
                            let temp = tempData[i];
                            // temp.timestamp = temp.timestamp + ct
                            temp.auth = JSON.parse(temp.auth)
    
                            // const data = {
                            //     ...connect.user,
                            //     device: command.data.device,
                            //     timestamp: command.data.timestamp,
                            // }
                            // user:  {
                            //     chat: '82',
                            //     device: 'mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/125.0.0.0 safari/537.36',
                            //     msg: '11111',
                            //     isAutowebinar: 0,
                            //     timestamp: '2024-06-03T06:02:45.100Z'
                            //   }
                            let data = null
                            if (temp.actionType == 'chat') {
                                data = {
                                    action: "message",
                                    data: {
                                        msg: temp.message,
                                        user: {
                                            type: 'token',
                                            authData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFsZXhob3Rwcm9AZ21haWwuY29tIiwiaWF0IjoxNzE3MDA2Njk5fQ.P7T7r8sW8utIPDs8GcpuvjuoKO2f9OyirOkwsm8mEfg',
                                            login: temp.login,
                                            auth:{"id":53,"login":temp.login,"name": temp.login,"hideDates":"N"},
                                            chat: temp.broadcastId,
                                            device: 'device1', 
                                            isAutowebinar: isAutowebinar,
                                            timestamp: temp.timestamp, 
                                        }
                                    }
                                }
                            } else if (temp.actionType == 'deleteChat') {
                                const deleteChat = JSON.parse(temp.data)
    
                                let deleteData = await this._mysql.execute(`
                                    SELECT *
                                    FROM event_log 
                                    WHERE logId = ${Number(deleteChat.ID)} 
                                    `)
                                data = {
                                    action: "deleteEventMessage",
                                    data: {
                                        msg: deleteData[0][0].message,
                                        login: deleteData[0][0].login
                                    }
                                }
                            } else if (temp.actionType == 'button') {
                                let linkData = JSON.parse(temp.data)
                                let login = JSON.parse(temp.note)
                                data = {
                                    action: "message",
                                    data: {
                                        msg: linkData.buttonLink,
                                        user: {
                                            type: 'token',
                                            auth: login,
                                            authData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFsZXhob3Rwcm9AZ21haWwuY29tIiwiaWF0IjoxNzE3MDA2Njk5fQ.P7T7r8sW8utIPDs8GcpuvjuoKO2f9OyirOkwsm8mEfg',
                                            login: login.login,
                                            chat: temp.broadcastId,
                                            name: linkData.buttonTitle,
                                            color: linkData.buttonColor,
                                            device: 'device1', 
                                            isAutowebinar: isAutowebinar,
                                            timestamp: temp.timestamp, 
                                        }
                                    }
                                }
                            } else if (temp.actionType == 'deleteButton') {
                                const deleteData = JSON.parse(temp.data)
                                let nameLink = null
                                let colorLink = null
                                let msgLink = null
                                let buttonData = await this._mysql.execute(`
                                    SELECT data
                                    FROM event_log 
                                    WHERE logId = ${Number(deleteData.buttonID)} 
                                    `)
                                buttonData = JSON.parse(buttonData[0][0].data)
                                nameLink = buttonData.buttonTitle
                                colorLink = buttonData.buttonColor
                                msgLink = buttonData.buttonLink
                                data = {
                                    action: "deleteLink",
                                    data: {
                                        msg: msgLink,
                                        user: {type: "link", name: nameLink, color: colorLink},
                                    }
                                }
                            } else if (temp.actionType == 'blockChat') {
                                let blockState = JSON.parse(temp.data)
                                blockState = blockState.ID
                                if (blockState == 'Заблокирован') {
                                    data = {
                                        action: 'chatUnBlock',
                                        data: {}
                                    }
                                } else {
                                    data = {
                                        action: 'chatBlock',
                                        data: {}
                                    }
                                }
                            } else if (temp.actionType == 'fixChat') {
                                let fixId = JSON.parse(temp.data)
                                let chatData = null
                                chatData = await this._mysql.execute(`
                                    SELECT logId, broadcastId, (${ct} + timeshift) as timestamp, username as login, message, 
                                            ${isAutowebinar} as isAutowebinar, 'ghoste' as type, 'eyJhbGciOiJI' as authData,
                                            'chat' as chat, 'mozilla/5.0 (windows nt 10.0; win64; x64)' as device,
                                            concat('{"id":8,"login":"', username, '"}') as auth, '::1' as ip , actionType, data, note
                                    FROM event_log 
                                    WHERE logId = ${Number(fixId.ID)} 
                                    `)
                                if (chatData[0]?.length) {
                                    if (chatData[0][0].actionType == 'button') {
                                        let linkData = JSON.parse(chatData[0][0].data)
                                        let login = JSON.parse(chatData[0][0].note)
                                        data = {
                                            action: 'pinMessageEvent',
                                            data: {
                                                msg: linkData.buttonLink,
                                                user: {
                                                    type: 'token',
                                                    auth: login,
                                                    authData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFsZXhob3Rwcm9AZ21haWwuY29tIiwiaWF0IjoxNzE3MDA2Njk5fQ.P7T7r8sW8utIPDs8GcpuvjuoKO2f9OyirOkwsm8mEfg',
                                                    login: login.login,
                                                    chat: chatData[0][0].broadcastId,
                                                    name: linkData.buttonTitle,
                                                    color: linkData.buttonColor,
                                                    device: 'device1', 
                                                    isAutowebinar: isAutowebinar,
                                                    timestamp: chatData[0][0].timestamp, 
                                                }
                                            }
                                        }
                                    } else if (chatData[0][0].actionType == 'chat') {
                                        data = {
                                            action: "pinMessageEvent",
                                            data: {
                                                msg: chatData[0][0].message,
                                                user: {
                                                    type: 'token',
                                                    authData: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFsZXhob3Rwcm9AZ21haWwuY29tIiwiaWF0IjoxNzE3MDA2Njk5fQ.P7T7r8sW8utIPDs8GcpuvjuoKO2f9OyirOkwsm8mEfg',
                                                    login: chatData[0][0].login,
                                                    auth:{"id":53,"login":chatData[0][0].login,"name": chatData[0][0].login,"hideDates":"N"},
                                                    chat: chatData[0][0].broadcastId,
                                                    device: 'device1', 
                                                    isAutowebinar: isAutowebinar,
                                                    timestamp: chatData[0][0].timestamp, 
                                                }
                                            }
                                        }
                                    }
                                }
                                
                            }
                            if (data) {
                                delay = temp.timestamp - beforTime
                                if (timeList.hasOwnProperty(delay)) {
                                    delay = delay + 1000
                                }
                                beforTime = temp.timestamp
                                timeList.push(delay)
                                eventList.push(data)
                            }
                        }
                    }
    
                    const runTimer = (delay, idx) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                // broadcasting..
                                this.events[index].push(eventList[idx])
                                const userIPs = this.getRoomUsers(isAutowebinar, index)
                                for (let i = 0; i < userIPs.length; i++) {
                                    // const address = this._rooms['1']['636'][0]
                                    const address = userIPs[i];
                                    const connectForSend = this.connections.get(address)
                                    connectForSend.connection.send(JSON.stringify(eventList[idx]))
                                }
                                resolve(true);
                            }, delay);
                        });
                    };
                    for ( var i = 0; i < timeList.length; i++ ) {
                        await runTimer(timeList[i], i);
                        // console.log( 'iterating', timeList[i]);
                    } 
                } else {
                    if (this.events[index]?.length) {
                        for (let i = 0; i < this.events[index].length; i++) {
                            const connectForSend = this.connections.get(address)
                            connectForSend.connection.send(JSON.stringify(this.events[index][i]))
                        }
                    }
                }
            }
            
        }

        if (command.action == "join") {
            if (!connect.user) {
                return
            }
            if (isAutowebinar != 1) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    if (!this._rooms[isAutowebinar][command.data.chat].includes(address)) {
                        this._rooms[isAutowebinar][command.data.chat].push(address)
                    }
                } else {
                    this._rooms[isAutowebinar][command.data.chat] = [address]
                }
            } else {
                const index = command.data.chat + '-' + command.data.roomNumber
                if (this._rooms[isAutowebinar].hasOwnProperty(index)) {
                    if (!this._rooms[isAutowebinar][index].includes(address)) {
                        this._rooms[isAutowebinar][index].push(address)
                    }
                } else {
                    this._rooms[isAutowebinar][index] = [address]
                }
            }


            // if (this.connections.has(address)) {
            //     const connectForSend = this.connections.get(address)

            //     connectForSend.connection.send(JSON.stringify({
            //         action: "startTime",
            //         data: {
            //             startTime: this._rooms[command.data.isAutowebinar][command.data.chat].startTime
            //         }
            //     }))

            // } else {
            //     this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
            // }
        }

        if (command.action == "editRoomJoin") {
            if (!connect.user) {
                return
            }
            if (this._editRooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                if (!this._editRooms[isAutowebinar][command.data.chat].includes(address)) {
                    this._editRooms[isAutowebinar][command.data.chat].push(address)
                }
            } else {
                this._editRooms[isAutowebinar][command.data.chat] = [address]
            }
            console.log("edit", this._editRooms)
        }

        let webinarId = command.data.chat
        let broadcastId = null
        // let webinarAndBroadcast = command.data.chat.split('__')
        let webinarAndBroadcast = null

        // if (this._rooms.hasOwnProperty(command.data.chat) && command.data.chat.indexOf('__') > 0) {
            // webinarAndBroadcast = command.data.chat.split('__')
        // }

        // if (command.action == "setStartTime") {
        //     this._rooms[command.data.isAutowebinar][command.data.chat].startTime = command.data.startTime
        //     console.log('startTime: ', this._rooms[command.data.isAutowebinar][command.data.chat].startTime)
        // }
        // if (command.action == "getStartTime") {
            
        // }
        if (command.action == "send") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    // if (command.data.chat.indexOf('__') > 0 && webinarAndBroadcast.length === 2) {
                        webinarId = command.data.chat // command.data.chat // webinarAndBroadcast[0]
                        broadcastId = command.data.chat // webinarAndBroadcast[1]
                        webinarAndBroadcast = null
                    // }
    
                    let res = await this._mysql.execute(`
                    SELECT * FROM ban
                    WHERE webinarId = ${webinarId}
                    `)
    
                    const bannedUsers = res[0]
                    res = null
    
                    if (!bannedUsers?.some((bu) => address.startsWith(bu.ip) && bu.device === command.data.device)) {
                        let res2 = await this._mysql.execute(`
                        SELECT * FROM ` + '`ignore` ' + `
                        WHERE webinarId = ${webinarId}
                        `)
    
                        const ignoredUsers = res2[0]
                        res2 = null
    
                        if (!ignoredUsers?.some((bu) => address.startsWith(bu.ip) && bu.device === command.data.device)) {
                            const data = {
                                ...connect.user,
                                device: command.data.device,
                                timestamp: command.data.timestamp,
                            }
                            for (let i = 0; i < this._rooms[command.data.isAutowebinar][command.data.chat].length; i++) {
                                const address = this._rooms[command.data.isAutowebinar][command.data.chat][i]
    
                                if (this.connections.has(address)) {
                                    const connectForSend = this.connections.get(address)
    
                                    connectForSend.connection.send(JSON.stringify({
                                        action: "message",
                                        data: {
                                            msg: command.data.msg,
                                            user: data
                                        }
                                    }))
    
                                } else {
                                //  this._rooms[command.data.chat].splice(i, 1);
                                    this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                                }
                            }
                            
                            if (command.data.isAutowebinar == '0')
                                broadcastId = null
                            else webinarId = null
                            delete data.isAutowebinar
    
                            await this._mysql.execute(`
                                INSERT INTO chat (webinarId, msg, data, broadcastId)
                                VALUES ("${webinarId ?? 'NULL'}", "${command.data.msg}", '${JSON.stringify(data)}', ${broadcastId ?? 'NULL'})
                            `)
                        } else {
                            if (this.connections.has(address)) {
                                const connectForSend = this.connections.get(address)
                                const data = {
                                    ...connect.user,
                                    device: command.data.device,
                                    timestamp: command.data.timestamp,
                                }
    
                                connectForSend.connection.send(JSON.stringify({
                                    action: "message",
                                    data: {
                                        msg: command.data.msg,
                                        user: data
                                    }
                                }))
                            }
                        }
                    } else {
                        if (this.connections.has(address)) {
                            const connectForSend = this.connections.get(address)
                            const data = {
                                ...connect.user,
                                device: command.data.device,
                                timestamp: command.data.timestamp,
                            }
    
                            connectForSend.connection.send(JSON.stringify({
                                action: "banUser",
                                data: {
                                    msg: command.data.msg,
                                    user: data
                                }
                            }))
                        }
                    }
                }
            } else {
                const index = command.data.chat + '-' + command.data.roomNumber
                if (this._rooms[isAutowebinar].hasOwnProperty(index)) {
                    // if (command.data.chat.indexOf('__') > 0 && webinarAndBroadcast.length === 2) {
                        broadcastId = command.data.chat // command.data.chat // webinarAndBroadcast[0]
                        broadcastId = command.data.chat // webinarAndBroadcast[1]
                        webinarAndBroadcast = null
                    // }
    
                    let res = await this._mysql.execute(`
                    SELECT * FROM ban
                    WHERE broadcastId = ${broadcastId}
                    `)
    
                    const bannedUsers = res[0]
                    res = null
    
                    if (!bannedUsers?.some((bu) => address.startsWith(bu.ip) && bu.device === command.data.device)) {
                        let res2 = await this._mysql.execute(`
                        SELECT * FROM ` + '`ignore` ' + `
                        WHERE broadcastId = ${broadcastId}
                        `)
    
                        const ignoredUsers = res2[0]
                        res2 = null
    
                        if (!ignoredUsers?.some((bu) => address.startsWith(bu.ip) && bu.device === command.data.device)) {
                            const data = {
                                ...connect.user,
                                device: command.data.device,
                                timestamp: command.data.timestamp,
                            }
                            for (let i = 0; i < this._rooms[command.data.isAutowebinar][index].length; i++) {
                                const address = this._rooms[command.data.isAutowebinar][index][i]
    
                                if (this.connections.has(address)) {
                                    const connectForSend = this.connections.get(address)
    
                                    connectForSend.connection.send(JSON.stringify({
                                        action: "message",
                                        data: {
                                            msg: command.data.msg,
                                            user: data
                                        }
                                    }))
    
                                } else {
                                //  this._rooms[index].splice(i, 1);
                                    this._rooms[isAutowebinar][index].splice(i, 1);
                                }
                            }
                            
                            if (command.data.isAutowebinar == '0')
                                broadcastId = null
                            else webinarId = null
                            delete data.isAutowebinar
    
                            // await this._mysql.execute(`
                            //     INSERT INTO chat (webinarId, msg, data, broadcastId)
                            //     VALUES ("${webinarId ?? 'NULL'}", "${command.data.msg}", '${JSON.stringify(data)}', ${broadcastId ?? 'NULL'})
                            // `)
                        } else {
                            if (this.connections.has(address)) {
                                const connectForSend = this.connections.get(address)
                                const data = {
                                    ...connect.user,
                                    device: command.data.device,
                                    timestamp: command.data.timestamp,
                                }
    
                                connectForSend.connection.send(JSON.stringify({
                                    action: "message",
                                    data: {
                                        msg: command.data.msg,
                                        user: data
                                    }
                                }))
                            }
                        }
                    } else {
                        if (this.connections.has(address)) {
                            const connectForSend = this.connections.get(address)
                            const data = {
                                ...connect.user,
                                device: command.data.device,
                                timestamp: command.data.timestamp,
                            }
    
                            connectForSend.connection.send(JSON.stringify({
                                action: "banUser",
                                data: {
                                    msg: command.data.msg,
                                    user: data
                                }
                            }))
                        }
                    }
                }
            }
        }

        if (command.action == "addLink") {
            
            let flag = false
            const id = command.data.chat

            if (command.data.isAutowebinar == '0')
                flag = false
            else flag = true

            const webinar = await this._mysql.execute(`
            SELECT *
            FROM ${(flag) ? 'broadcast': 'webinar'}
            WHERE id = '${id}'
            `)

            const links = (webinar[0][0]['links']) ? JSON.parse(webinar[0][0]['links']) : []

            links.push({
                nameLink: command.data.name,
                msgLink: command.data.msg,
                colorLink: command.data.color,
            })

            await this._mysql.execute(`
                UPDATE ${(flag) ? 'broadcast': 'webinar'} 
                SET links ='${JSON.stringify(links)}'
                WHERE id = '${id}'
            `)
            console.log("addLink")
            if (this._editRooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                console.log(this._editRooms)
                for (let i = 0; i < this._editRooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._editRooms[isAutowebinar][command.data.chat][i]
                    console.log(address)
                    if (this.connections.has(address)) {
                        const connect = this.connections.get(address)
                        connect.connection.send(JSON.stringify({
                            action: "addLink",
                            data: {
                                nameLink: command.data.name,
                                msgLink: command.data.msg,
                                colorLink: command.data.color,
                            }
                        }))
                    } else {
                        this._editRooms[isAutowebinar][command.data.chat].splice(i, 1);
                    }
                }
            }
        }

        if (command.action == "sendLink") {
            let authUser = connect.user
            authUser.timestamp = new Date()
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "message",
                                data: {
                                    msg: command.data.msg,
                                    user: {type: "link", name: command.data.name, color: command.data.color, ...authUser},
                                }
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
                let res = await this._mysql.execute(`
                    SELECT * FROM chat WHERE msg='`+command.data.msg+`' AND `+`webinarId=`+Number(command.data.chat)+` AND `+` status !='-1' 
                `)
                
                let result = null

                if (res[0].length === 0) {
                    await this._mysql.execute(`
                            INSERT INTO chat (webinarId,msg,data,status) 
                            VALUES ("${
                                command.data.chat.replace('"', "'")}", "${command.data.msg
                            }", '${
                                JSON.stringify( {type: "link", name: command.data.name, color: command.data.color, ...authUser})
                            }', 1)
                        `)
                    
                    let data = {
                        "buttonID": 1,
                        "buttonTitle": command.data.name,
                        "buttonLink": command.data.msg,
                        "buttonStatus": "",
                        "buttonColor": command.data.color 
                    }
                    authUser.auth.id = String(authUser.auth.id)
                    const insert = await this._mysql.execute(`
                        INSERT INTO event_log (broadcastId, actionType, timeshift, data, username, note)
                        VALUES(-1, 'button', '${command.data.timeshift}', '${JSON.stringify(data)}', '', '${JSON.stringify(authUser.auth)}')     
                        `)
                    let insertId = 1
                    if (insert) {
                        insertId = insert[0].insertId
                    }
                    const updateData = {
                        "buttonID": String(insertId),
                        "buttonTitle": command.data.name,
                        "buttonLink": command.data.msg,
                        "buttonStatus": "",
                        "buttonColor": command.data.color 
                    }

                    await this._mysql.execute(`
                        UPDATE event_log
                        SET data = '${JSON.stringify(updateData)}'
                        WHERE logId = ${insertId}
                    `)
                }
                
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "message",
                                    data: {
                                        msg: command.data.msg,
                                        user: {type: "link", name: command.data.name, color: command.data.color, ...authUser},
                                    }
                                }))
                            }
                        }
                    }
                }
            }
            
        }

        if (command.action == "editLink") {
            const authUser = connect.user
            const webinar = await this._mysql.execute(`
                SELECT *
                FROM webinar
                WHERE id = '${command.data.chat.replace('"', "'")}'
                `)

            let links = (webinar[0][0]['links']) ? JSON.parse(webinar[0][0]['links']) : []

            for (const [idx, link] of links.entries()) {
                if (
                    link.nameLink === command.data.oldName
                    && link.msgLink === command.data.oldMsg
                    && link.colorLink === command.data.oldColor
                ) {
                    links.splice(
                        idx,
                        1,
                        {
                            nameLink: command.data.name,
                            msgLink: command.data.msg,
                            colorLink: command.data.color,
                        }
                    )
                }
            }

            await this._mysql.execute(`
                    UPDATE webinar 
                    SET links ='${JSON.stringify(links)}'
                    WHERE id = ${command.data.chat.replace('"', "'")}
            `)
            await this._mysql.execute(`
                    UPDATE chat 
                    SET msg = '${command.data.msg}' ,
                        data = '${JSON.stringify( {type: "link", name: command.data.name, color: command.data.color, ...authUser})}'  
                    WHERE webinarId = '${command.data.chat.replace('"', "'")}'
                    AND msg = '${command.data.oldMsg}'
                    AND data like '%"name":"${command.data.oldName}","color":"${command.data.oldColor}"%'
            `)

            if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]

                    if (this.connections.has(address)) {
                        const connect = this.connections.get(address)

                        connect.connection.send(JSON.stringify({
                            action: "editLink",
                            data: {
                                msg: command.data.msg,
                                user: {type: "link", name: command.data.name, color: command.data.color},
                                oldMsg: command.data.oldMsg,
                                oldUser: {name: command.data.oldName, color: command.data.oldColor},
                            }
                        }))
                    } else {
                        this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                    }
                }
            }
        }

        if (command.action == "deleteLink" || command.action == "deleteLinkFromWebinar") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "deleteLink",
                                data: {
                                    msg: command.data.msg,
                                    user: {type: "link", name: command.data.name, color: command.data.color},
                                }
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
                 
                await this._mysql.execute(`
                    DELETE FROM chat
                    WHERE webinarId = '${command.data.chat.replace('"', "'")}'
                    AND msg = '${command.data.msg}'
                    AND data like '%"name":"${command.data.name}","color":"${command.data.color}"%'
                `)
                let insertedRow = null
                insertedRow = await this._mysql.execute(`
                   SELECT * FROM event_log
                    WHERE broadcastId = -1 
                    AND data like '%"buttonTitle":"${command.data.name}"%'
                `)
                if (insertedRow) {
                    const data = {
                        "buttonID": String(insertedRow[0][insertedRow[0].length - 1].logId)
                    }

                    await this._mysql.execute(`
                        INSERT INTO event_log (broadcastId, actionType, timeshift, data, username, note)
                        VALUES(-1, 'deleteButton', '${command.data.timeshift}', '${JSON.stringify(data)}', '', '')     
                    `)
                }
                
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "deleteLink",
                                    data: {
                                        msg: command.data.msg,
                                        user: {type: "link", name: command.data.name, color: command.data.color},
                                    }
                                }))
                            }
                        }
                    }
                }
            }

            if (command.action == "deleteLinkFromWebinar") {
                if (!isAutowebinar) {
                    const webinar = await this._mysql.execute(`
                        SELECT *
                        FROM webinar
                        WHERE id = '${command.data.chat.replace('"', "'")}'
                    `)
        
                    let links = (webinar[0][0]['links']) ? JSON.parse(webinar[0][0]['links']) : []
    
                    for (const [idx, link] of links.entries()) {
                        if (
                            link.nameLink === command.data.name
                            && link.msgLink === command.data.msg
                            && link.colorLink === command.data.color
                        ) {
                            links.splice(idx, 1)
                        }
                    }
                    
                    await this._mysql.execute(`
                        UPDATE webinar 
                        SET links ='${JSON.stringify(links)}'
                        WHERE id = ${command.data.chat.replace('"', "'")}
                    `)
                }  else {
                    const broadcast = await this._mysql.execute(`
                        SELECT *
                        FROM broadcast
                        WHERE id = '${command.data.chat.replace('"', "'")}'
                    `)
        
                    let links = (broadcast[0][0]['links']) ? JSON.parse(broadcast[0][0]['links']) : []
    
                    for (const [idx, link] of links.entries()) {
                        if (
                            link.nameLink === command.data.name
                            && link.msgLink === command.data.msg
                            && link.colorLink === command.data.color
                        ) {
                            links.splice(idx, 1)
                        }
                    }
                    
                    await this._mysql.execute(`
                        UPDATE broadcast 
                        SET links ='${JSON.stringify(links)}'
                        WHERE id = ${command.data.chat.replace('"', "'")}
                    `)
                }
            }
        }

        if (command.action == "deleteMessages") {
            console.log(command.data.messages)
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "deleteMessages",
                                data: {
                                    messages: command.data.messages,
                                }
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }

                await this._mysql.execute(`
                    UPDATE chat 
                        SET status = -1, deleteTime = '${command.data.timestamp}'
                    WHERE webinarId = ${command.data.chat}
                        AND (${command.data.messages.map((m) => `(msg = '${m.msg}' AND data = '${JSON.stringify(m.user)}')`).join(' OR ')})
                    `)
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "deleteMessages",
                                    data: {
                                        messages: command.data.messages,
                                    }
                                }))
                            }
                        }
                    }
                }

                await this._mysql.execute(`
                    DELETE FROM event_log
                    WHERE broadcastId = ${command.data.chat}
                        AND actionType = 'chat' AND (${command.data.messages.map((m) => `(message = '${m.msg}' AND username = '${m.user.auth.login}')`).join(' OR ')})
                    `)
            }
        }

        if (command.action == "deleteMessagesAndBanUser") {
            const { adminId, moderatorsIds } = await this._getAdminAndModeratorsIds(command.data.chat)

            const bannedUsers = Array.from(new Set(command.data.messages
                .filter((m) => m.user.auth?.id !== adminId && !moderatorsIds.includes(m.user.auth?.id))
                .map((m) => {
                    return m.user.ip + '___' + m.user.device
                }))
            ).map((u) => {
                const [ip, device] = u.split('___')
                return {
                    ip: ip,
                    device: device,
                }
            })

            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "deleteMessagesAndBanUser",
                                data: {
                                    bannedUsers: bannedUsers,
                                }
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
    
                await this._mysql.execute(`
                    UPDATE chat 
                    SET status = -1, deleteTime = '${command.data.timestamp}'
                    WHERE webinarId = ${command.data.chat}
                        AND (${bannedUsers.map(
                                (u) => `(JSON_EXTRACT(data, "$.ip") = '${u.ip}' AND JSON_EXTRACT(data, "$.device") = '${u.device}')`
                            ).join(' OR ')})
                    `)
    
                await this._mysql.execute(`
                    INSERT INTO ban (webinarId, ip, device)
                    VALUES ${bannedUsers.map((u) => {
                        return `('${command.data.chat}', '${u.ip}', '${u.device}')`
                    }).join(',\n')}
                `)
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "deleteMessagesAndBanUser",
                                    data: {
                                        bannedUsers: bannedUsers,
                                    }
                                }))
                            }
                        }
                    }
                }

                await this._mysql.execute(`
                    INSERT INTO ban (ip, device, broadcastId)
                    VALUES ${bannedUsers.map((u) => {
                        return `('${u.ip}', '${u.device}', '${command.data.chat}')`
                    }).join(',\n')}
                `)
            }
        }

        if (command.action == "banUser") {
            const { adminId, moderatorsIds } = await this._getAdminAndModeratorsIds(command.data.chat)

            const bannedUsers = Array.from(new Set(command.data.messages
                .filter((m) => m.user.auth?.id !== adminId && !moderatorsIds.includes(m.user.auth?.id))
                .map((m) => {
                    return m.user.ip + '___' + m.user.device
                }))
            ).map((u) => {
                const [ip, device] = u.split('___')
                return {
                    ip: ip,
                    device: device,
                }
            })

            console.log('This users will be banned', bannedUsers)

            if (!isAutowebinar) {
                await this._mysql.execute(`
                    INSERT INTO ban (webinarId, ip, device)
                    VALUES ${bannedUsers.map((u) => {
                        return `('${command.data.chat}', '${u.ip}', '${u.device}')`
                    }).join(',\n')}
                    `)
            } else {
                await this._mysql.execute(`
                    INSERT INTO ban (ip, device, broadcastId)
                    VALUES ${bannedUsers.map((u) => {
                        return `('${u.ip}', '${u.device}', '${command.data.chat}')`
                    }).join(',\n')}
                    `)
            }
        }

        if (command.action == "ignoreUser") {
            const { adminId, moderatorsIds } = await this._getAdminAndModeratorsIds(command.data.chat)

            const ignoredUsers = Array.from(new Set(command.data.messages
                .filter((m) => m.user.auth?.id !== adminId && !moderatorsIds.includes(m.user.auth?.id))
                .map((m) => {
                    return m.user.ip + '___' + m.user.device
                }))
            ).map((u) => {
                const [ip, device] = u.split('___')
                return {
                    ip: ip,
                    device: device,
                }
            })

            console.log('This users will be ignored', ignoredUsers)

            if (!isAutowebinar) {
                await this._mysql.execute(`
                    INSERT INTO ` + '`ignore` ' + `(webinarId, ip, device)
                    VALUES ${ignoredUsers.map((u) => {
                        return `('${command.data.chat}', '${u.ip}', '${u.device}')`
                    }).join(',\n')}
                `)
            } else {
                await this._mysql.execute(`
                    INSERT INTO ` + '`ignore` ' + `(ip, device, broadcastId)
                    VALUES ${ignoredUsers.map((u) => {
                        return `('${u.ip}', '${u.device}', '${command.data.chat}')`
                    }).join(',\n')}
                `)
            }
        }

        if (command.action == "chatBlock") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "chatBlock",
                                data: {}
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
    
                await this._mysql.execute(`
                   UPDATE webinar set blockedChat = 'Y' where id = '${command.data.chat}'
                `)

                const data = {
                    "ID": "Заблокирован"
                }

                await this._mysql.execute(`
                    INSERT INTO event_log (broadcastId, actionType, timeshift, data, message)
                    VALUES(-1, 'blockChat', '${command.data.timeshift}', '${JSON.stringify(data)}', 'Блокировка/разблокировка чата')
                `)
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "chatBlock",
                                    data: {}
                                }))
                            }
                        }
                    }
                }
    
                await this._mysql.execute(`
                   UPDATE broadcast set blockedChat = 'Y' where id = '${command.data.chat}'
                `)
            }
        }
        if (command.action == "chatUnBlock") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "chatUnBlock",
                                data: {}
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
    
                await this._mysql.execute(`
                   UPDATE webinar set blockedChat = 'N' where id = '${command.data.chat}'
                `)

                const data = {
                    "ID": "Разблокирован"
                }

                await this._mysql.execute(`
                    INSERT INTO event_log (broadcastId, actionType, timeshift, data, message)
                    VALUES(-1, 'blockChat', '${command.data.timeshift}', '${JSON.stringify(data)}', 'Блокировка/разблокировка чата')
                `)
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "chatUnBlock",
                                    data: {}
                                }))
                            }
                        }
                    }
                }

                await this._mysql.execute(`
                    UPDATE broadcast set blockedChat = 'N' where id = '${command.data.chat}'
                `)
            }
        }

        if (command.action == "allowChatLinks") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "allowChatLinks",
                                data: {}
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
    
                await this._mysql.execute(`
                   UPDATE webinar set allowChatLinks = 'Y' where id = '${command.data.chat}'
                `)
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "allowChatLinks",
                                    data: {}
                                }))
                            }
                        }
                    }
                }
                await this._mysql.execute(`
                    UPDATE broadcast set allowChatLinks = 'Y' where id = '${command.data.chat}'
                 `)
            }
        }

        if (command.action == "disallowChatLinks") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "disallowChatLinks",
                                data: {}
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
    
                await this._mysql.execute(`
                   UPDATE webinar set allowChatLinks = 'N' where id = '${command.data.chat}'
                `)
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "disallowChatLinks",
                                    data: {}
                                }))
                            }
                        }
                    }
                }
                await this._mysql.execute(`
                    UPDATE broadcast set allowChatLinks = 'Y' where id = '${command.data.chat}'
                 `)
            }
        }

        if (command.action == "clearChat") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                        if (this.connections.has(address)) {
                            const connect = this.connections.get(address)
    
                            connect.connection.send(JSON.stringify({
                                action: "clearChat",
                                data: {}
                            }))
                        } else {
                            this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                        }
                    }
                }
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "clearChat",
                                    data: {}
                                }))
                            }
                        }
                    }
                }
            }

            if (!isAutowebinar) {
                await this._mysql.execute(`
                    UPDATE chat 
                    SET status = -1
                    WHERE webinarId = '${command.data.chat}'
                        AND JSON_EXTRACT(data, "$.type") != 'link'
                `)
            }

            // await this._mysql.execute(`
            //     UPDATE webinar 
            //     SET comment = '', commentData = ''
            //     WHERE id = ${command.data.chat}
            // `)
        }

        if (command.action == "sendZakrepComment") {
            if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                const data = {
                    ...connect.user,
                    device: command.data.device,
                    timestamp: command.data.timestamp,
                    priority: 1,
                }

                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]

                    if (this.connections.has(address)) {
                        const connectForSend = this.connections.get(address)

                        connectForSend.connection.send(JSON.stringify({
                            action: "message",
                            data: {
                                msg: command.data.msg,
                                user: data
                            }
                        }))
                    }
                }

                await this._mysql.execute(`
                INSERT INTO chat (webinarId,msg,data)
                VALUES ("${command.data.chat.replace('"', "'")}", "${command.data.msg}", '${JSON.stringify(data)}')
                `)
            }
        }

        if (command.action == "addAction") {
            for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                const address = this._rooms[isAutowebinar][command.data.chat][i]

                if (this.connections.has(address)) {
                    const connectForSend = this.connections.get(address)
                    const data = {
                        ...connect.user,
                        device: command.data.device,
                        timestamp: command.data.timestamp,
                    }

                    connectForSend.connection.send(JSON.stringify({
                        action: "addAction",
                        data: {
                            action: {
                                ...command.data.action,
                                username: connect.user.auth.login,
                                timestamp: Date.now(),
                            },
                            user: data
                        }
                    }))
                }
            }
        }

        if (command.action == "startStream") {
            // console.log('playTime: ', this._rooms[isAutowebinar].hasOwnProperty(command.data.chat))
            // console.log(this._rooms[isAutowebinar])
            if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]
                    if (this.connections.has(address)) {
                        const connect = this.connections.get(address)

                        connect.connection.send(JSON.stringify({
                            action: "startStream",
                            data: {
                                playTime: command.data.playTime,
                            }
                        }))

                    } else {
                        this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                    }
                }

                await this._mysql.execute(`
                   UPDATE webinar set status = 1 where id = ${command.data.chat}
                `)

                console.log('start stream', command.data.chat)
            }
        }

        if (command.action == "stopStream") {
            if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]

                    if (this.connections.has(address)) {
                        const connect = this.connections.get(address)

                        connect.connection.send(JSON.stringify({
                            action: "stopStream"
                        }))

                    } else {
                        this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                    }
                }

                await this._mysql.execute(`
                   UPDATE webinar set status = 0 where id = ${command.data.chat}
                `)
                // await this._mysql.execute(`
                //     DELETE FROM webinar WHERE id = ${command.data.chat}
                // `)
                await this._mysql.execute(`
                    DELETE FROM ghoste WHERE webinarId = ${command.data.chat}
                `)

                console.log('finish stream', command.data.chat)
            }
        }
        
        if (command.action == "showScreen") {
            if (!isAutowebinar) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                    if (this.connections.has(address)) {
                        const connectForSend = this.connections.get(address)
                        connectForSend.connection.send(JSON.stringify({
                            action: "showScreen",
                            data: {
                                msg: command.data.message,
                                status: command.data.status,
                            }
                        }))
                    }
                }
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "showScreen",
                                    data: {
                                        msg: command.data.message,
                                        status: command.data.status,
                                    }
                                }))
                            }
                        }
                    }
                }
            }
        }

        if (command.action == "pinMessage") {
            if (!isAutowebinar) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                    if (this.connections.has(address)) {
                        const connectForSend = this.connections.get(address)
                        connectForSend.connection.send(JSON.stringify({
                            action: "pinMessage",
                            data: {
                                pinMessage: command.data.pinMessage,
                                pinedMessage: command.data.pinedMessage,
                            }
                        }))
                    }
                }
            } else {

                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "pinMessage",
                                    data: {
                                        pinMessage: command.data.pinMessage,
                                        pinedMessage: command.data.pinedMessage,
                                    }
                                }))
                            }
                        }
                    }
                }
            }

            var table = isAutowebinar ? 'broadcast' : 'webinar'

            var currentWebinarId = isAutowebinar ? 'NULL' : command.data.chat;
            var currentBroadcastId = isAutowebinar ? command.data.chat : 'NULL'

            if (!isAutowebinar) {
                if (command.data.pinedMessage.length !== 0) {
                    await this._mysql.execute(`
                        INSERT INTO chat (webinarId, msg, data, broadcastId)
                        VALUES ("${currentWebinarId}", "${command.data.pinedMessage[0].msg}", '${JSON.stringify(command.data.pinedMessage[0].user)}', ${currentBroadcastId})
                    `)
                }
    
                await this._mysql.execute(`
                    UPDATE FROM chat 
                    SET status = -1
                    WHERE data = '${JSON.stringify(command.data.pinMessage.user)}'
                `)
            }
            
            const res = await this._mysql.execute(`
                UPDATE ${table} 
                SET comment = '${command.data.pinMessage.msg}', commentData = '${JSON.stringify(command.data.pinMessage.user)}'
                WHERE id = ${command.data.chat}
            `)
        }

        if (command.action == "eventPinMessage") {
            const index = command.data.chat + '-' + command.data.roomNumber
            if (this._rooms[isAutowebinar].hasOwnProperty(index)) {
                for (let i = 0; i < this._rooms[isAutowebinar][index].length; i++) {
                    const address = this._rooms[isAutowebinar][index][i]
    
                    if (this.connections.has(address)) {
                        const connectForSend = this.connections.get(address)
                        connectForSend.connection.send(JSON.stringify({
                            action: "pinMessage",
                            data: {
                                pinMessage: command.data.pinMessage,
                                pinedMessage: command.data.pinedMessage,
                            }
                        }))
                    }
                }
            }
        }

        if (command.action == "unpinMessage") {

            if (!isAutowebinar) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]
    
                    if (this.connections.has(address)) {
                        const connectForSend = this.connections.get(address)
                        connectForSend.connection.send(JSON.stringify({
                            action: "unpinMessage",
                            data: {
                                msg: command.data.message,
                            }
                        }))
                    }
                }
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "unpinMessage",
                                    data: {
                                        msg: command.data.message,
                                    }
                                }))
                            }
                        }
                    }
                }
            }

            var table = isAutowebinar ? 'broadcast' : 'webinar'

            var currentWebinarId = isAutowebinar ? 'NULL' : command.data.chat;
            var currentBroadcastId = isAutowebinar ? command.data.chat : 'NULL'

            if (!isAutowebinar) {
                await this._mysql.execute(`
                    INSERT INTO chat (webinarId, msg, data, broadcastId)
                    VALUES ("${currentWebinarId}", "${command.data.message.msg}", '${JSON.stringify(command.data.message.user)}', ${currentBroadcastId})
                `)
            }

            const res = await this._mysql.execute(`
                UPDATE ${table} 
                SET comment = '', commentData = ''
                WHERE id = ${command.data.chat}
            `)

        }

        if (command.action == "changeInsideBackground") {
            for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                const address = this._rooms[isAutowebinar][command.data.chat][i]

                if (this.connections.has(address)) {
                    const connectForSend = this.connections.get(address)
                    connectForSend.connection.send(JSON.stringify({
                        action: "changeInsideBackground",
                        data: {
                            background: command.data.background
                        }
                    }))
                }
            }
            
            const table = isAutowebinar ? 'broadcast' : 'webinar';
            const res = await this._mysql.execute(`
                UPDATE ${table} 
                SET backgroundImageInside = '${command.data.background}' 
                WHERE id = ${command.data.chat}
            `)
        }

        if (command.action == "updateRoom") {
            if (!isAutowebinar) {
                if (this._rooms[isAutowebinar][command.data.chat]) {
                    for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                        const address = this._rooms[isAutowebinar][command.data.chat][i]
        
                        if (this.connections.has(address)) {
                            const connectForSend = this.connections.get(address)
                            connectForSend.connection.send(JSON.stringify({
                                action: "updateRoom",
                                data: {
                                    roomData: command.data.roomData
                                }
                            }))
                        }
                    }
                }
            } else {
                for (const [key, value] of Object.entries(this._rooms[isAutowebinar])) {
                    if (key.includes(command.data.chat + '-')) {
                        for (let i = 0; i < this._rooms[isAutowebinar][key].length; i++) {
                            const address = this._rooms[isAutowebinar][key][i]
                            if (this.connections.has(address)) {
                                const connect = this.connections.get(address)
                                connect.connection.send(JSON.stringify({
                                    action: "updateRoom",
                                    data: {
                                        roomData: command.data.roomData
                                    }
                                }))
                            }
                        }
                    }
                }
            }
        }

        if (command.action == "sendHeart") {
            if (this._rooms[isAutowebinar].hasOwnProperty(command.data.chat)) {
                for (let i = 0; i < this._rooms[isAutowebinar][command.data.chat].length; i++) {
                    const address = this._rooms[isAutowebinar][command.data.chat][i]

                    if (this.connections.has(address)) {
                        const connect = this.connections.get(address)
                        connect.connection.send(JSON.stringify({
                            action: "sendHeart"
                        }))

                    } else {
                        this._rooms[isAutowebinar][command.data.chat].splice(i, 1);
                    }
                }
            }
        }
    }

    join(pretty, user) {

    }

    createRoom(pretty) {

    }

    sendToChat(pretty, user, msg) {

    }

    async _getAdminAndModeratorsIds(webinarId) {
        const [adminAndModerators] = await this._mysql.execute(`
            SELECT 
                w.userId as adminId, 
                m.userId as moderatorId
            FROM webinar AS w
            LEFT JOIN moderate AS m
                ON m.webinarId = w.id
            WHERE w.id = ?
            `, [webinarId])

        const adminId = adminAndModerators[0]?.adminId
        const moderatorsIds = adminAndModerators
            .map((row) => row.moderatorId)
            .filter((mi) => mi !== null)

        return {
            adminId,
            moderatorsIds,
        }
    }

    getRoomUsers(isAutowebinar, roomId) {
        return this._rooms[isAutowebinar][roomId]
    }
}
