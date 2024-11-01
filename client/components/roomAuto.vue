<template>
  <div class="room-page" :style="{...backgroundImage}" >
    <!-- <v-container> -->
      <div class="room-content" >
        <!-- <script async src="https://www.youtube.com/iframe_api"></script> -->
        <div class="header-wrapper" >
          <div class="header__content">
            <div class="header__logo">
              <div class="logo" style="text-decoration: none;">
                <img class="logo-img" src="../static/logo.png" alt="" >
                <p class="logo__name">NEEARBY.PRO</p>
                <p class="menu__title" id="menu_title">{{ windowWidth < 500 ? cutString(roomTitle, 15) : roomTitle }}</p>
              </div>
            </div>
            <div class="header-profile-icons" id="headerProfileIcons">
              <div style="display: none;" class="profile__icon" @click="() => {
                  if (links.length) {
                    openBagMoneyContentModal()
                  } else {
                    openBagMoneyWaitModal()
                  }
                }"
              >
                <img src="../static/svg/moneyChat.svg" alt="">
              </div>
              <div style="display: none;" class="profile__icon" @click="openSupportModal">
                <img src="../static/svg/support.svg" alt="">
              </div>
              <div class="profile__icon" style="cursor: default" v-click-outside="() => {dayNightModeMenuOpen = false}">
                <button aria-haspopup="menu" @click="dayNightModeMenuToggle($event)" style="cursor: pointer">
                  <img src="../static/svg/fluent_paint-brush-24-regular.svg" alt="">
                </button>
                <ul class="dropdown-content" role="menu" :style="dayNightModeMenuOpen ? 'visibility: visible' : ''">
                  <li :style="dayNightModeMenuOpen ? 'left: 0' : ''">
                    <div class="search_filter__input">
                      <img class="day-night-mode-icon" src="../static/svg/day-mode.svg"/>
                      <span>Дневной режим</span>
                    </div>
                    <div class="dropdown-backgrounds-line">
                      <div
                        class="dropdown-background"
                        @click="changeInsideBackground('web_background_inside_0.png')"
                        :style="{
                          'border': (backgroundImage?.['background-image']?.includes('web_background_inside_0.png')) ? '3px solid #FF5C00' : ''
                      }"
                      >
                        <img :src="$config.staticURL + '/web_background_inside_0.png'"/>
                      </div>
                      <div
                        class="dropdown-background"
                        @click="changeInsideBackground('web_background_inside_1.png')"
                        :style="{
                        'border': (backgroundImage?.['background-image']?.includes('web_background_inside_1.png')) ? '3px solid #FF5C00' : ''
                      }"
                      >
                        <img :src="$config.staticURL + '/web_background_inside_1.png'"/>
                      </div>
                      <div
                        class="dropdown-background"
                        @click="changeInsideBackground('web_background_inside_2.png')"
                        :style="{
                          'margin-right': 0,
                          'border': (backgroundImage?.['background-image']?.includes('web_background_inside_2.png')) ? '3px solid #FF5C00' : ''
                      }"
                      >
                        <img :src="$config.staticURL + '/web_background_inside_2.png'"/>
                      </div>
                    </div>
                    <div class="search_filter__input">
                      <img class="day-night-mode-icon" src="../static/svg/night-mode.svg"/>
                      <span>Ночной режим</span>
                    </div>
                    <div class="dropdown-backgrounds-line">
                      <div
                        class="dropdown-background"
                        @click="changeInsideBackground('web_background_inside_3.png')"
                        :style="{
                        'border': (backgroundImage?.['background-image']?.includes('web_background_inside_3.png')) ? '3px solid #FF5C00' : ''
                      }"
                      >
                        <img :src="$config.staticURL + '/web_background_inside_3.png'"/>
                      </div>
                      <div
                        class="dropdown-background"
                        @click="changeInsideBackground('web_background_inside_4.png')"
                        :style="{
                          'border': (backgroundImage?.['background-image']?.includes('web_background_inside_4.png')) ? '3px solid #FF5C00' : ''
                      }"
                      >
                        <img :src="$config.staticURL + '/web_background_inside_4.png'"/>
                      </div>
                      <div
                        class="dropdown-background"
                        @click="changeInsideBackground('web_background_inside_5.png')"
                        :style="{
                        'margin-right': 0,
                        'border': (backgroundImage?.['background-image']?.includes('web_background_inside_5.png')) ? '3px solid #FF5C00' : ''
                      }"
                      >
                        <img :src="$config.staticURL + '/web_background_inside_5.png'"/>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div style="display: none;" class="profile__icon volume-hidden" @click="() => {
                  if (volumeOff) {
                    onVolume()
                  } else {
                    offVolume()
                  }
                }">
                <img v-if="!volumeOff" src="../static/svg/ps_sound-level-two.svg" alt="">
                <img v-if="volumeOff" src="../static/svg/volume-off.svg" alt="">
              </div>
              <div class="profile__icon" @click="openLeaveRoomModal">
                <img src="../static/svg/icomoon-free_exit.svg" alt="">
              </div>
            </div>
          </div>
          <div style="display: none;" class="profile__icon volume" @click="() => {
                  if (volumeOff) {
                    onVolume()
                  } else {
                    offVolume()
                  }
                }">
            <img v-if="!volumeOff" src="../static/svg/ps_sound-level-two.svg" alt="">
            <img v-if="volumeOff" src="../static/svg/volume-off.svg" alt="">
          </div>
          <button class="menu-hamburger" @click="toggleMenu"></button>
        </div>
        <div class="room-parent">
          <div class="room-wrapper">
            <div class="room" >
              <div v-if="isModer || isAdmin" class="main__webinar__buttons" >
                <button class="buttons__translate" @click="openStartStreamModal" v-if="isAdmin && !status && !isAutoWebinar">Начать трансляцию</button>
                <button class="buttons__translate" @click="openStopStreamModal" v-if="isAdmin && status && !isAutoWebinar">Завершить трансляцию</button>
                <!--          <button class="buttons__setting" v-if="!isBlockChat" @click="blockChat">Отключить чат</button>-->
                <!--          <button class="buttons__setting" v-else @click="unBlockChat">Включить чат</button>-->
                <a>
                  <button class="buttons__setting" @click="goEditWebinar">Основные настройки</button>
                </a>
                <button class="buttons__addchat btn-addchat-hidden" @click="openAddLinkModal">Добавить ссылку в чат</button>
              </div>
              <div class="player-wrapper" id="totalWindow">
                <div id="player" >
                  <!-- <video
                    v-if="videoType"
                    id="video-player"
                    class="video-js vjs-default-skin"
                    preload="auto"
                    playsinline
                  >
                    <source src="" type="video/x-flv" />
                  </video> -->
                  <video
                    id="video-player"
                    class="video-js vjs-default-skin"
                    preload="auto"
                    playsinline
                  >
                    <source src="" type="video/mp4" />
                  </video>
                  <div id="player__overlay">
                    <div id="player__header">
                      <div id="player__errorText"></div>
                    </div>
                    <div id="player__footer"></div>
                  </div>
                  <div id="playerWindow" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; background: transparent;"></div> 
                </div>
                <div class="black-box" id="black" >
                  <div class="black-content">
                    <div id="screensaverVideo"></div>
                    <div id="screen__overlay">
                      <div id="screen__header">
                        <div id="screen__errorText"></div>
                      </div>
                      <div id="screen__footer"></div>
                    </div>
                    <div id='screenWindow' style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; background: transparent;"></div> 
                    <div class="startPole" id="pole" v-if="dateStartPole != ''">
                      <v-icon aria-label="My Account" role="img" aria-hidden="false">
                        mdi-clock-time-nine-outline
                      </v-icon>
                      <span class="logo__name">{{ dateStartPole }}</span>  
                    </div>
                  </div>
                </div>
                <div class="notification-container" ref="notifiRef">
                  <div v-for="heart in hearts" class="anim-heart-wrapper" :style="{left: heart.x + 'px', width: heart.w + 'px'}">
                    <span class="anim-heart"></span>
                  </div>
                </div>
                <button class="video-volume" id="volume" type="button" @click="unMute">
                  <v-icon aria-label="My Account" role="img" aria-hidden="false">
                    mdi-volume-high
                  </v-icon>
                  Включить звук
                </button>
                <div v-if="isCenterLink" class="room_action_notification__container"  @click="clickCenterLink({ type: 'clickLink', msg: centerLink.msg, })">
                  <div class="action_notification__icon">
                    <v-avatar size="50" style="margin-left: 5px; margin-right: 10px" color="blue">
                        <v-img
                          :src="authorAvatar"
                          alt="Фото не загружено"
                        ></v-img>
                    </v-avatar>
                  </div>
                  <div style="width: 100%; display: flex; flex-direction: column; gap: 5px;">
                    <div class="link_action_notification__msg_container">
                      <div class="messageUser">
                        {{ cutString(adminInfo?.name, 20) }}
                      </div>
                      <div class="messageContent">
                        <p class="link_action_notification__msg" :style="{'background-color': centerLink.color}">
                          <NuxtLink
                            is="a"
                            :to="centerLink.msg" 
                            :href="centerLink.msg"
                            target="_blank" 
                            style="
                              overflow-wrap: 'anywhere',
                            "
                          >
                            {{centerLink.username}}
                          </NuxtLink>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div id="rightMessage">
                  <div class="screenContent">
                    <div class="messageUserAvatar">
                      <v-avatar size="40" style="margin-left: 5px; margin-right: 10px" color="blue">
                        <v-img
                          :src="messageUserAvatar"
                          alt="Фото не загружено"
                        ></v-img>
                      </v-avatar>
                    </div>
                    <div class="messageDiv">
                      <div class="messageUser">
                        {{ cutString(messageUsername, 20) }}
                      </div>
                      <div class="messageContent">
                        <div v-if="!isLink(messageContent)">{{ messageContent }}</div>
                        <div v-else>
                          <a :href="messageContent" target="_blank" :style="{'overflow-wrap': 'anywhere'}">{{ messageContent }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="pinComment" class="comment">
                    {{ pinComment }}
                  </div>
                </div>
              </div>
              <div id="mobilePole" v-if="dateStartPole != ''">
                <v-icon aria-label="My Account" role="img" aria-hidden="false">
                  mdi-clock-time-nine-outline
                </v-icon>
                <span class="logo__name">{{ dateStartPole }}</span>  
              </div>
              <div style="display: flex; justify-content: center; align-items: center" v-if="screensaverAudio" id="screensaverAudioDiv">
                <audio controls id="screensaverAudio" src=""></audio>
              </div>
              <div style="display:none">
                <audio controls id="linkSound" src=""></audio>
              </div>
              <action-notifications
                v-if="actions.length"
                :actions-emitter="actionsEmitter"
                :actions="actions"
              />
            </div>
            <div class="chat">
              <div class="webinar__chat__user">
                <v-avatar size="60">
                  <v-img
                    :src="authorAvatar"
                    alt="Фото не загружено"
                  ></v-img>
                </v-avatar>
                <div class="webinar__chat__title">
                  <div class="subtitle">
                      <p class="add" style="position: relative; color: black">Ведущий: 
                        <span 
                          @mouseover="tooltipFlag = true"
                          @mouseleave="tooltipFlag = false"
                          v-click-outside="tooltipClose"
                          style="cursor: pointer; color: #0077FF; "  
                          v-bind:class = "{'descriptionBlack' : !this.userDescription }"
                        >
                          {{ authorName }}
                          <img style="margin-top: -5px;" src="../static/svg/corona.svg" alt="">
                        </span>
                      </p>
                    <div class="authDescription" v-if="tooltipFlag && userDescription">
                      {{ userDescription }}
                    </div>
                    <p class="adds" style="color: black;margin-top: 9px;">{{ authorStatus }}</p>
                    
                  </div>
                </div>
              </div>
              <div class="webinar__chat__chat">
                <div class="webinar__chat__guest" v-bind:class = "{'webinar__chat__guest__dark' : this.darkMode }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" v-if="this.darkMode">
                    <path fill="white" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" v-else>
                    <path fill="gray" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z" />
                  </svg>
                  <p v-if="chatNumber !== 0" class="guest">Участников: {{ chatNumber }}</p>
                  <p v-else class="guest">Участников: 0</p>
                </div>
                <div
                  v-if="isModer || isAdmin"
                  class="moder_panel"
                >
                  <div class="moder_btn moder_highlight">
                    <div style="height: 25px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_highlight.svg" alt="">
                    </div>
                    <p>
                      {{ this.highlightedMessages.length }}
                    </p>
                  </div>
                  <div class="moder_btn moder_delete" @click="deleteMessages">
                    <div style="height: 19px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_delete.svg" alt="">
                    </div>
                    <p>
                      Удалить
                    </p>
                  </div>
                  <div class="moder_btn moder_ban_delete" @click="deleteMessagesAndBanUser">
                    <div style="height: 19px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_ban_delete.svg" alt="">
                    </div>
                    <p>
                      Удалить + бан
                    </p>
                  </div>
                  <div class="moder_btn moder_ban" @click="banUser">
                    <div style="height: 19px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_ban.svg" alt="">
                    </div>
                    <p>
                      Бан
                    </p>
                  </div>
                  <div class="moder_btn moder_ignor" @click="ignoreUser">
                    <div style="height: 19px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_ignore.svg" alt="">
                    </div>
                    <p>
                      Игнор
                    </p>
                  </div>
                </div>
                <!-- show links -->
                <div
                  v-if="sendLinks.length"
                  class="chating_links"
                  id="chatLinks"
                >
                  <div v-for="link in sendLinks">
                    <div
                      ref="linkItem"
                      @click="addActionWS({
                        type: 'clickLink',
                        msg: link.msgLink,
                      })"
                    >
                      <NuxtLink
                        class="chating_link"
                        is="a"
                        :to="link.msgLink"
                        :href="link.msgLink"
                        :style="{
                        'font-size': '20px', width: '100%',
                        'overflow-wrap': 'break-word', color: 'white',
                        'margin-top': '5px', 'background-color': link.colorLink,
                        'color': 'white'
                      }" target="_blank"
                      >
                        <div style="height: 25px">
                          <img src="../static/svg/chat_link_present-open.svg" alt="">
                        </div>
                        <div :style="{ 'text-align': 'center' }">
                          <p style="width: 100%; overflow-wrap: anywhere;" :class="getChattingLinkClass(link.nameLink)">
                            {{ getChattingLinkMsg(link.nameLink) }}
                          </p>
                        </div>
                        <div style="height: 23px; align-items: center">
                          <img src="../static/svg/chat_link_arrow-circle-right-rounded.svg" alt="">
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <div id="chating" :style="{
                  'padding-right': '5px',
                  'min-height': 'auto',
                  'overflow-y': 'auto',
                  'display': 'flex',
                  'flex-direction': 'column',
                  'flex-grow': 2
                }">
                <!-- 'max-height': calcChatHeight(), -->
                  <div v-for="(item, index) in items" style="font-family: 'Roboto';"> <!-- .filter((elem) => elem.user.type === 'message') -->
                    <div v-if="item?.user?.type == 'ghoste'"  class="form__author" :style="{
                        'position': 'relative',
                        width: '100%',
                        'margin-top': '5px',
                        'border-radius': '5px', 
                        cursor: (isAdmin || isModer) ? 'pointer' : 'default',
                        border: ((isAdmin || isModer) && findHighlightedMessage(item)) ? '1px solid #FE6637' : 'none',
                        'background-color': getBackgroundColor(item),
                        'align-items': 'center',
                      }"
                    >
                      <v-avatar size="40" style="margin-left: 5px; margin-right: 10px" color="blue">
                        <!-- {{ item.user.data[0] }} User -->
                      </v-avatar>
                      <div 
                        style="width: 90%; " 
                        @click="highlightMessage(item)"
                        @contextmenu.prevent="showMenu('ghoste' + index)"
                      >
                        <div style="display: flex; justify-content: flex-start; align-items: center">
                          <p class="author__name" style="font-weight: 900; display: inline-block; margin-right: 10px">
                            {{ item.user.auth.login }} <!-- {{ item.user.data }} -->
                          </p>
                          <p style="line-height: 10px; font-size: 10px; color: rgb(73,71,71)">{{ getMessageTime(item.user.timestamp) }}</p>
                        </div>
                        <p v-if="!isLink(item.msg)" style="width: 90%; overflow-wrap: break-word;">{{ item.msg }}</p>
                        <div v-else >
                          <p v-if="!item.user.color">{{ item.user.name }}</p>
                          <p :style="{ 'display': 'inline-block', 'padding-left': '5px', 'padding-right': '5px', 'border-radius': '3px', 'overflow-wrap': 'anywhere', 'background-color': item.user.color }">
                            <a v-if="item.user.color" :href="item.msg" style="color: white;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.user.name }}</a>
                            <a v-else :href="item.msg" style="color: black;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.msg }}</a>
                          </p>
                        </div>
                      </div>
                      <div v-if="showContextMenu && activeItem === ('ghoste' + index)" v-click-outside="outsideMenu" class="contextMenu" >
                        <div class="contextMenuContent">
                          <button class="menuBtn" @click="showScreen(item)">Показать на экране</button>
                          <button class="menuBtn" @click="pinMessage(item)">Закрепить в чат</button>
                        </div>
                      </div>
                    </div>
                    <!-- v....else....if="item?.user?.auth?.id == webinar.userId"  -->
                    <div  v-else-if="item?.user?.type == 'token'" class="form__author" :style="{
                        'position': 'relative',
                        width: '100%',
                        'margin-top': '5px',
                        'border-radius': '5px',
                        cursor: (isAdmin || isModer) ? 'pointer' : 'default',
                        border: ((isAdmin || isModer) && findHighlightedMessage(item)) ? '1px solid #FE6637' : 'none',
                        'background-color': getBackgroundColor(item),
                        'align-items': 'center',
                      }"
                    >
                      <v-avatar size="40" style="margin-left: 5px; margin-right: 10px" color="blue">
                        <v-img
                          :src="authorAvatar"
                          alt="Фото не загружено"
                        ></v-img>
                      </v-avatar>
                      <div 
                        style="width: 90%;"
                        @click="highlightMessage(item)"
                        @contextmenu.prevent="showMenu('token' + index)"
                      >
                        <div 
                          style="display: flex; justify-content: flex-start; align-items: center"
                        >
                          <p class="author__name chat_admin_color" style="font-weight: 900; display: inline-block; margin-right: 10px">{{ item.user.auth.name }}</p>
                          <div class="img" style="display: inline-block">
                            <img style="width: 15px; margin-right: 8px" src="../static/svg/corona.svg" alt="">
                          </div>
                          <p style="line-height: 10px; font-size: 10px; color: rgb(73,71,71)">{{ getMessageTime(item.user.timestamp) }}</p>
                        </div>
                        <p v-if="!isLink(item.msg)" style="width: 90%; overflow-wrap: break-word;">{{ item.msg }}</p>
                        <div v-else >
                          <p v-if="!item.user.color">{{ item.user.name }}</p>
                          <p :style="{ 'display': 'inline-block', 'padding-left': '5px', 'padding-right': '5px', 'border-radius': '3px', 'overflow-wrap': 'anywhere', 'background-color': item.user.color }">
                            <a v-if="item.user.color" :href="item.msg" style="color: white;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.user.name }}</a>
                            <a v-else :href="item.msg" style="color: black;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.msg }}</a>
                          </p>
                        </div>
                      </div>
                      <div v-if="showContextMenu && activeItem === ('token' + index)" v-click-outside="outsideMenu" class="contextMenu" >
                        <div class="contextMenuContent">
                          <button class="menuBtn" @click="showScreen(item)">Показать на экране</button>
                          <button class="menuBtn" @click="pinMessage(item)">Закрепить в чат</button>
                        </div>
                      </div>
                    </div>
                    <div v-else class="form__author" style="width: 90%;margin-top: 5px">
                      <v-avatar size="40" style="margin-left: 0px; margin-right: 10px" color="blue">
                        {{ item.user.auth.login[0] }}
                      </v-avatar>
                      <div style="width: 90%;">
                        <div style="display: flex; justify-content: flex-start; align-items: center">
                          <p class="author__name" style="font-weight: 900; display: inline-block; margin-right: 10px">{{ item.user.auth.login }}</p>
                          <p style="line-height: 10px; font-size: 10px; color: rgb(73,71,71)">{{ getMessageTime(item.user.timestamp) }}</p>
                        </div>
                        <p style="width: 90%; overflow-wrap: break-word;">{{ item.msg }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- sss -->
                <div>
                  <div v-if="pinItems.length !== 0" class="customLine"></div>
                  <div v-for="(item, index) in pinItems" style="font-family: 'Roboto'; width: 100%;"> <!-- .filter((elem) => elem.user.type === 'message') -->
                    <div v-if="item?.user?.type == 'ghoste'"  class="form__author__custom" :style="{
                        'position': 'relative',
                        width: '100%',
                        'margin-top': '5px',
                        'border-radius': '5px',
                        cursor: (isAdmin || isModer) ? 'pointer' : 'default',
                        'background-color': 'rgba(255, 219, 186, 0.6)',
                        'align-items': 'center',
                      }"
                    >
                      <div class="pinContent">
                        <v-avatar size="40" color="blue">
                          <!-- {{ item.user.data[0] }} User -->
                        </v-avatar>
                        <div 
                          style="width: 90%; " 
                          @contextmenu.prevent="showMenu('pin' + index)"
                        >
                          <div style="display: flex; justify-content: space-between; align-items: center">
                            <div style="display: flex; gap: 10px; justify-content: flex-start; align-items: center;">
                              <p class="author__name" style="font-weight: 900; display: inline-block; ">
                                {{ item.user.auth.login }} <!-- {{ item.user.data }} -->
                              </p>
                              <p 
                                style="line-height: 10px; 
                                  font-size: 10px; 
                                  color: rgb(73,71,71)"
                              >
                                {{ getMessageTime(item.user.timestamp) }}
                              </p>
                            </div>
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path 
                                  fill="#dac212"
                                  fill-rule="evenodd" 
                                  d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 0 0 .86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 0 0-.86.34z"
                                />
                              </svg>
                            </div>
                          </div>
                          <p v-if="!isLink(item.msg)" style="width: 90%; overflow-wrap: break-word;">{{ item.msg }}</p>
                          <div v-else >
                            <p v-if="!item.user.color">{{ item.user.name }}</p>
                            <p :style="{ 'display': 'inline-block', 'padding-left': '5px', 'padding-right': '5px', 'border-radius': '3px', 'overflow-wrap': 'anywhere', 'background-color': item.user.color }">
                              <a v-if="item.user.color" :href="item.msg" style="color: white; overflow-wrap: 'anywhere';" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.user.name }}</a>
                              <a v-else :href="item.msg" style="color: black;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.msg }}</a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="comment">
                        Сообщение закреплено
                      </div>
                      <div v-if="showContextMenu && activeItem === ('pin' + index)" v-click-outside="outsideMenu" class="contextMenu" >
                        <div class="contextMenuContent">
                          <button class="menuBtn" @click="showScreen(item, 'pin')">Показать на экране</button>
                          <button class="menuBtn" @click="unpinMessage()">Открепить из чата</button>
                        </div>
                      </div>
                    </div>
                    <!-- v....else....if="item?.user?.auth?.id == webinar.userId"  -->
                    <div  v-else-if="item?.user?.type == 'token'" class="form__author__custom" :style="{
                        'position': 'relative',
                        width: '100%',
                        'margin-top': '5px',
                        'border-radius': '5px',
                        cursor: (isAdmin || isModer) ? 'pointer' : 'default',
                        'background-color': 'rgba(255, 219, 186, 0.6)',
                        'align-items': 'center',
                      }"
                    >
                      <div class="pinContent">
                        <v-avatar size="40" color="blue">
                          <v-img
                            :src="authorAvatar"
                            alt="Фото не загружено"
                          ></v-img>
                        </v-avatar>
                        <div 
                          style="width: 90%;"
                          @contextmenu.prevent="showMenu('pinToken' + index)"
                        >
                          <div 
                            style="display: flex; justify-content: flex-start; align-items: center"
                          >
                            <p class="author__name chat_admin_color" style="font-weight: 900; display: inline-block; margin-right: 10px">{{ item.user.auth.name }}</p>
                            <div class="img" style="display: inline-block">
                              <img style="width: 15px; margin-right: 8px" src="../static/svg/corona.svg" alt="">
                            </div>
                            <p style="line-height: 10px; font-size: 10px; color: rgb(73,71,71)">{{ getMessageTime(item.user.timestamp) }}</p>
                          </div>
                          <p v-if="!isLink(item.msg)" style="width: 90%; overflow-wrap: break-word;">{{ item.msg }}</p>
                          <div v-else >
                            <p v-if="!item.user.color">{{ item.user.name }}</p>
                            <p :style="{ 'display': 'inline-block', 'padding-left': '5px', 'padding-right': '5px', 'border-radius': '3px', 'overflow-wrap': 'anywhere', 'background-color': item.user.color }">
                              <a v-if="item.user.color" :href="item.msg" style="color: white;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.user.name }}</a>
                              <a v-else :href="item.msg" style="color: black;" target="_blank" @click="addActionWS({ type: 'clickLink', msg: item.msg, })">{{ item.msg }}</a>
                            </p>
                          </div>
                        </div>
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path 
                              fill="#dac212"
                              fill-rule="evenodd" 
                              d="M10 1.2V2l.5 1L6 6H2.2c-.44 0-.67.53-.34.86L5 10l-4 5 5-4 3.14 3.14a.5.5 0 0 0 .86-.34V10l3-4.5 1 .5h.8c.44 0 .67-.53.34-.86L10.86.86a.5.5 0 0 0-.86.34z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="comment">
                        Сообщение закреплено
                      </div>
                      <div v-if="showContextMenu && activeItem === ('pinToken' + index)" v-click-outside="outsideMenu" class="contextMenu" >
                        <div class="contextMenuContent">
                          <button class="menuBtn" @click="showScreen(item, 'pin')">Показать на экране</button>
                          <button class="menuBtn" @click="unpinMessage()">Открепить из чата</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- sss -->
                <div style="margin-top: 5px; border: 1px solid #818C99; background-color: white; border-radius: 10px; display: flex; align-content: center; justify-content: space-between;"
                >
                  <input
                    id="id_of_textbox"
                    v-on:keyup.enter="sendMsg"
                    v-model="msg"
                    :style="{
                      'max-width': '87%', 
                      'margin-left': '5px',
                      display: 'inline-block',
                      outline: 'none',
                    }"
                    type="text"
                    clearable
                    :placeholder="(iBanned || !isActive) ? 'Вы забанены' : (isBlockChat && (!isAdmin && !isModer)) ? 'Чат заблокирован' : 'Введите сообщение..'"
                    :disabled="(iBanned || isBlockChat || !isActive || isBlockChatBeforeStart) && (!isAdmin && !isModer)"
                  ></input>
                  <div style="display: flex; justify-content: center; align-items: center; padding-left: 5px; gap: 3px; ">
                    <button @click="onHeart" class="chat-heart" type="button" 
                                                  :disabled="iBanned || isBlockChat || !isActive">&nbsp;</button>
                    <button
                      id="id_of_button"
                      @click="sendMsg"
                      style="
                      display: inline-block;
                      background-color: white;
                      border-radius: 50%;
                      padding: 0;
                      width: 30px;
                      height: 40px;
                    "
                      :disabled="(iBanned || isBlockChat || !isActive || isBlockChatBeforeStart) && (!isAdmin && !isModer)"
                    >
                      <v-icon>
                        mdi-send
                      </v-icon>
                    </button>
                  </div>
                </div>

                <div
                  v-if="isModer || isAdmin"
                  class="moder_panel_bottom"
                >
                  <div class="moder_btn moder_bottom" @click="(isBlockChat || isBlockChatBeforeStart) ? unBlockChat() : blockChat()">
                    <div style="height: 23px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_off.svg" alt="">
                    </div>
                    <p class="text__black" v-bind:class="{ 'text__white' : this.darkMode }" >
                      {{ (this.isBlockChat || this.isBlockChatBeforeStart) ? 'Чат выключен' : 'Чат включен' }}
                    </p>
                  </div>
                  <div class="moder_btn moder_bottom" @click="(allowChatLinks) ? disableChatLinks() : enableChatLinks()">
                    <div style="height: 23px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_links_off.svg" alt="">
                    </div>
                    <p class="text__black" v-bind:class="{ 'text__white' : this.darkMode }">
                      {{ (this.allowChatLinks) ? 'Ссылки разрешены' : 'Ссылки запрещены' }}
                    </p>
                  </div>
                  <div class="moder_btn moder_bottom" @click="openClearChatModal">
                    <div style="height: 23px; margin-right: 3px">
                      <img src="../static/svg/moder_chat_clear.svg" alt="" v-if="this.darkMode">
                      <img src="../static/svg/moder_chat_clear_dark.svg" alt="" v-else>
                    </div>
                    <p class="text__black" v-bind:class="{ 'text__white' : this.darkMode }">
                      Очистить чат
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                Добавить ссылку в чат

                <v-text-field id="id_of_textbox" v-model="nameLink" style="width: 100%;margin-top: 20px; margin-bottom: 50px" clearable
                              label="Введите название ссылки"></v-text-field>
                <v-text-field id="id_of_textbox" v-model="msgLink" style="width: 100%;margin-top: 20px; margin-bottom: 50px" clearable
                              label="Введите ссылку"></v-text-field>

                <v-btn
                  color="primary"
                  text
                  @click="addLinkToChat"
                >
                  Добавить
                </v-btn>
              </v-card-title>
            </v-card>
          </v-dialog>
        </div>
        <bag-money-wait
          v-if="bagMoneyWaitModalOpen"
          :close-modal="closeBagMoneyWaitModal"
        />
        <bag-money-content
          v-if="bagMoneyContentModalOpen"
          :close-modal="closeBagMoneyContentModal"
          :links="links"
        />
        <support-webinar
          v-if="supportModalOpen"
          :close-modal="closeSupportModal"
        />
        <leave-room
          v-if="leaveRoomModalOpen"
          :redirect="redirectOut"
          :close-modal="closeLeaveRoomModal"
        />
        <start-translate
          v-if="startStreamModalOpen"
          :close-modal="closeStartStreamModal"
          v-on:start-stream="startStream"
        />
        <stop-stream
          v-if="stopStreamModalOpen"
          :close-modal="closeStopStreamModal"
          v-on:stop-stream="stopStream"
        />
        <add-in-chat
          v-if="addLinkModalOpen"
          :links="links"
          :close-modal="closeAddLinkModal"
          v-on:add-link="addLinkToChat"
          v-on:send-link="sendLinkToChat"
          v-on:edit-link="editLink"
          v-on:delete-link="deleteLink"
          v-on:delete-link-from-webinar="deleteLinkFromWebinar"
        />
        <delete-all-message
          v-if="clearChatModalOpen"
          :close-modal="closeClearChatModal"
          v-on:clear-chat="clearChat"
        />
        <video-notification 
          v-if="videoNotification"
          :close-modal="closeVideoNotification"
        />
        <end-webinar 
          v-if="stopState"
          :close-modal="closeEndWebinar"
        />
      </div>
    <!-- </v-container> -->
  </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs';
import flvjs from 'flv.js';
let rt = null
let testPlayer = null;
let screenPlayer = null;
let flvPlayer = null
let isAutowebinar

let startInterval = null;
let middleInterval = null;
let endInterval = null;

 var ua = navigator.userAgent,
      html = document.documentElement;
  if (ua.indexOf("Chrome") > -1) {
    html.classList.add("is-chrome");
  } else if (ua.indexOf("Firefox") > -1) {
    html.classList.add("is-firefox");
  } else if (ua.indexOf("Edge") > -1) {
    html.classList.add("is-edge");
  } else if (ua.indexOf("Safari") > -1) {
    html.classList.add("is-safari");
  }

import BagMoneyWait from "~/components/Modals/bagMoneyWait.vue";
import BagMoneyContent from "~/components/Modals/bagMoneyContent.vue";
import SupportWebinar from "~/components/Modals/supportWebinar.vue";
import LeaveRoom from "~/components/Modals/leaveRoom.vue";
import StartTranslate from "~/components/Modals/startTranslate.vue";
import StopStream from "~/components/Modals/stopStream.vue";
import AddInChat from "~/components/Modals/addInChat.vue";
import VideoNotification from "~/components/Modals/videoNotification.vue"
import EndWebinar from "~/components/Modals/endWebinar.vue"

import moment from "moment-timezone"
import DeleteAllMessage from "@/components/Modals/deleteAllMessage.vue";
import SendedLink from "@/components/Modals/sendedLink.vue";
import ActionNotifications from "@/components/Modals/actionNotifications.vue";
import { EventEmitter } from "events"
import { mapState } from 'vuex';

import Rutube from "rutube-player"

export default {
  name: "RoomAuto",
  components: {
    ActionNotifications,
    SendedLink,
    DeleteAllMessage, 
    AddInChat, 
    StartTranslate, 
    LeaveRoom, 
    SupportWebinar, 
    BagMoneyContent, 
    BagMoneyWait, 
    StopStream, 
    VideoNotification,
    EndWebinar,
  },
  computed: {
    ...mapState([
      'roomTitle', 'authorName', 'authorStatus', 'screensaverVideoState'
    ]),
  },

  data() {
    return {
      videoType: 0,
      videoSrc: '',
      windowWidth: null,
      adminInfo: null,
      autoWebinarSource: '',
      startState: false,
      stopState: false,
      videoNotification: false,
      isActive: 0,
      pinComment: '',
      showContextMenu: '',
      activeItem: '',
      messageUserAvatar: '',
      messageUsername: '',
      messageContent: '',
      pinItems: [],
      audioPlayerStatus: false,
      tooltipFlag: false,
      webinarData: '',
      isAutoWebinar: 0,
      playTime: 0,
      hideDates: 'N',
      // nChatWrapperHeight: 65,
      isCenterLink: false,
      centerLink: null,
      hearts: [],
      webinarId: null,
      dialog: false,
      items: [],
      sendLinks: [],
      links: [
        // {
        //   nameLink: 'Богатей с Алексом Жарким. Подпишись',
        //   msgLink: 'https://vk.com/alexhotpro'
        // },
        // {
        //   nameLink: 'Группа Алекса Жаркого. Подпишись',
        //   msgLink: 'https://vk.com/alexhot'
        // },
      ],
      screensaverAudio: '',
      newAudio: '',
      screensaverPhoto: '',
      screensaverVideo: '',
      nameLink: "",
      msgLink: "",
      user: {},
      dateStartPole: "",
      isBlockChat: false,
      isBlockChatBeforeStart: false,
      msg: "",
      socket: null,
      dateStart: "",
      playbackFrequency: "",
      webinar: {},
      redirectOut: "",
      videoPlayer: null,
      screensaverVideoPlayer: null,
      status: 0,
      tittleChat: "",
      chatNumber: 0,
      // authorName: "",
      // authorStatus: "",
      authorAvatar: "",
      // title: "",
      userDescription: '',
      readyYT: false,
      outRedirectUrl: null,
      bagMoneyWaitModalOpen: false,
      bagMoneyContentModalOpen: false,
      supportModalOpen: false,
      roomThemeMenuOpen: false,
      volumeOff: false,
      leaveRoomModalOpen: false,
      startStreamModalOpen: false,
      stopStreamModalOpen: false,
      addLinkModalOpen: false,
      clearChatModalOpen: false,
      banWords: [],
      backgroundImage: {
        background: 'rgb(237, 238, 240)',
      },
      notificationSoundAddLink: false,
      audioNotification: null,
      dayNightModeMenuOpen: false,
      videoPlay: true,
      videoProgress: 0,
      isAdmin: false,
      isModer: false,
      highlightedMessages: [],
      iBanned: false,
      allowChatLinks: true,
      notAllowLinksAlert: false,
      banWordAlert: false,
      comment: '',
      commentData: '',
      actionsEmitter: new EventEmitter(),
      actions: [],
      darkMode: false,
      duration: 0,
      playback: 'Y',
      url: '',
      publish: '',
      roomNumber: 1,
    }
  },
  mounted() {
    Notification.requestPermission().then(function(result) {
      console.log(result);
    });
    
    // testPlayer = videojs('video-player');
    // testPlayer.on('error', function() {
    // const errorDisplay = testPlayer.getChild('errorDisplay');
    //   if (errorDisplay) {
    //     errorDisplay.hide(); // Hide the default error display
    //   }
    // });

    this.windowWidth = window.innerWidth
    var div = document.getElementById('screensaverVideo');
    console.log(div)
    div.addEventListener('resize', (event) => console.log(event.detail));

    function checkResize (mutations) {
        var el = mutations[0].target;
        var w = el.clientWidth;
        var h = el.clientHeight;
        
        var isChange = mutations
          .map((m) => m.oldValue + '')
          .some((prev) => prev.indexOf('width: ' + w + 'px') == -1 || prev.indexOf('height: ' + h + 'px') == -1);

        if (!isChange)
          return;

        var event = new CustomEvent('resize', {detail: {width: w, height: h}});
        el.dispatchEvent(event);
    }

    var observer = new MutationObserver(checkResize); 
    observer.observe(div, {attributes: true, attributeOldValue: true, attributeFilter: ['style']});
    
    if (window.innerWidth > 500 && window.innerWidth < 1921) {
      if (this.roomTitle.length < 30) {
        document.getElementById('menu_title').style.fontSize = "24px";
      } else if (this.roomTitle.length < 50) {
        document.getElementById('menu_title').style.fontSize = "20px";
      } else if (this.roomTitle.length < 100) {
        document.getElementById('menu_title').style.fontSize = "18px";
      } else
        document.getElementById('menu_title').style.fontSize = "10px";
    } else if (window.innerWidth > 1920) {
      document.getElementById('menu_title').style.fontSize = "24px";
    } else {
      document.getElementById('menu_title').style.fontSize = "16px";
    }

    const routePath = this.$route.path
    isAutowebinar = (routePath.includes('/a/') || routePath.includes('/ann/') ? 1 : 0)
    const isSecret = (routePath.includes('/wnn/') || routePath.includes('/ann/') ? 1 : 0)
    this.isAutoWebinar = isAutowebinar
    
    if (isSecret == 0 && localStorage.getItem("token")) {
      this.$axios.post(
          `/auth/check-user-token`,
          {
            token: localStorage.getItem("token"),
          }
        ).then(userData => {
          if (userData && userData.data?.id) {
            // this.user = userData.data
            this.user.id = userData.data.id
            this.user.login = userData.data.login
            this.hideDates = userData.hideDates
          }
        })
    }
    const webinarSearch = this.$route.params.id;   
    this.$axios.get(`/webinars/prettyLink?prettyLink=${webinarSearch}&isAutowebinar=${isAutowebinar}`)
      .then(data => {
        this.$axios.post(`/users/getAdminInfo`, {
          userId: data.data.userId
        }).then(response => {
          console.log(response)
          this.adminInfo = response.data.data
        })
        this.videoType = data.data.videoType
        if (data.data.videoType) {
          this.videoSrc = process.env.STATIC_URL + '/recording/' + data.data.source
        } else {
          this.videoSrc = process.env.STATIC_URL + '/' + data.data.source
        }

        this.webinarData = data.data
        this.isActive = data.data.isActive
        this.webinarId = data.data.id
        this.url = data.data.url
        this.userDescription = data.data.userDescription
        // this.authorStatus = data.data.userStatus
        // this.authorName = data.data.userName
        // this.title = data.data.title
        this.screensaverPhoto = data.data.screensaverPhoto
        this.screensaverAudio = data.data.screensaverAudio
        this.screensaverVideo = data.data.screensaverVideo
        const newData = {
          roomTitle: data.data.title,
          authorStatus: data.data.userStatus,
          authorName: data.data.userName,
        }
        this.$store.commit('updateRoom', newData);
        this.status = data.data.status
        this.items = (data.data.chat?.length) ? data.data.chat.map(msg => {
          return {
            msg: msg.msg,
            user: JSON.parse(msg.data)}
        }) : []
        console.log("items", this.items)
        this.items.sort((a, b) => new Date(a.user.timestamp) - new Date(b.user.timestamp))
        console.log("item", this.items)
        this.sendLinks = []
        this.items.forEach((item) => {
          if (this.isLink(item.msg)) {
            if (item.user.color) {
              const flag = this.sendLinks.find(m => { 
                return m.msgLink === item.msg 
                  && m.colorLink === item.user.color
                  && m.nameLink === item.user.name })
                                
              if (true || !flag) {
                this.sendLinks.push({
                  msgLink: item.msg,
                  colorLink: item.user.color,
                  nameLink: item.user.name,
                })
              }
            }
          }
        });
        // if (this.sendLinks.length !== 0) {
        //   this.isCenterLink = true
        //   this.centerLink = {
        //     username: this.sendLinks[this.sendLinks.length - 1].nameLink,
        //     msg: this.sendLinks[this.sendLinks.length - 1].msgLink,
        //     color: this.sendLinks[this.sendLinks.length - 1].colorLink
        //   }
        //   console.log("centerLink!!!", this.sendLinks)
        //   setTimeout(() => {
        //     this.isCenterLink = false
        //   }, 30000);
        // }
        
        // this.items = this.items.filter((item) => {
        //   return (item.msg)})
        this.comment = data.data.comment
        this.commentData = data.data.commentData
        if (this.comment !== '' && this.comment !== null) {
          var parseData = {
            id: data.data.id,
            msg: this.comment,
            user: JSON.parse(this.commentData)
          }
          this.pinItems.pop()
          this.pinItems.push(parseData)
        }
        this.dateStart = data.data.dateStart
        this.playbackFrequency = data.data.playbackFrequency
        this.background = this.$config.staticURL + '/' + data.data.backgroundIn
        if (data.data.userAvatar !== '' && data.data.userAvatar !== null) {
          this.authorAvatar = this.$config.staticURL + '/' + data.data.userAvatar
        } else {
          this.authorAvatar = `/author__photo.png`
        }
        this.source = data.data.source
        this.redirectOut = data.data.redirectOut

        const banWords = data.data.banWords?.split('; ')

        if (banWords?.length && banWords[0]) {
          this.banWords = banWords
        }

        if (data.data.backgroundImageInside) {
          
          var temp = data.data.backgroundImageInside.substr(data.data.backgroundImageInside.length - 5, 1);
          this.darkMode = temp >= 3 ?  true : false; 

          this.backgroundImage = {
            'background-image': `url('${this.$config.staticURL + '/' + data.data.backgroundImageInside}')`,
          }
          //  'background-size': '100% auto',
        }

        this.isBlockChatBeforeStart = (data.data.blockChatBeforeStart === 'Y') ? true : false

        if (!this.status) {
          if (data.data.blockedChat === 'Y' || (data.data.blockChatBeforeStart === 'Y')) {
            this.isBlockChat = true
          } else if (data.data.blockedChat === 'N' && (data.data.blockChatBeforeStart === 'N')) {
            this.isBlockChat = false
          }
        } else {
          if (data.data.blockedChat === 'Y') {
            this.isBlockChat = true
          } else if (data.data.blockedChat === 'N') {
            this.isBlockChat = false
          }
        }

        this.notificationSoundAddLink = (data.data.addLinkNotificationSound === 'Y') ? true : false
        console.log("Mounted", data.data.links)
        this.links = (data.data.links) ? data.data.links : []
        if (localStorage.getItem('token') && localStorage.getItem('userId') == data.data.userId) {
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
        this.isModer = data.data?.moderators?.includes(this.user.id)
        this.duration = (data.data.duration !== null || data.data.duration !== 0) ? data.data.duration : 0  
        this.allowChatLinks = (data.data?.allowChatLinks === 'Y') ? true : false
        this.playback = !this.isAutoWebinar ? data.data.playback : this.playback
        // return data.data
        this.webinar = data.data
        if (this.webinarData === '') {
          window.location.href = 'https://neearby.pro'
        }

        this.webinarData.duration = 3600000;
        if (isAutowebinar && this.webinarData.viewersQuantityStart) {
          this.chatNumber = this.webinarData.viewersQuantityStart;
          
        } 

        this.$nextTick(() => {
          const chating = document.getElementById("chating")
          chating.scrollTop = chating.scrollHeight;

          const chatingLinks = document.querySelector(".chating_links")
          if (chatingLinks) {
            chatingLinks.scrollTop = chatingLinks.scrollHeight;
          }
        })
        

        const socket = new WebSocket(process.env.SOCKET_URL);

        const nameGhoste = localStorage.getItem("nameGhoste")
        let auth;
        if (isSecret == 0 && localStorage.getItem("token")) {
          auth = {
            type: "token",
            data: localStorage.getItem("token")
          }
          // const userData = await this.$axios.$post(
          //       `/auth/check-user-token`,
          //       {
          //         token: auth.data,
          //       }
          //     )
          // if (userData?.hideDates) {
          //   this.hideDates = userData.hideDates
          // }
        } else if (isSecret == 0 && nameGhoste && !nameGhoste.includes('победитель')) {
          auth = {
            type: "ghoste",
            data: nameGhoste
          }
        } else if (isSecret == 1 && !localStorage.getItem("token")) {
          localStorage.setItem("nameGhoste", "победитель")
          auth = {
            type: "ghoste",
            data: localStorage.getItem("nameGhoste")
          }
        } else {
          localStorage.setItem("isAutoWebinar", 1);
          this.$router.push(`/s/${this.$route.params.id}`)
        }

        // socket.onopen = function () {
        //   let strLogin = 'User'
        //   if(localStorage.getItem("login")) strLogin = localStorage.getItem("login")
        //   else strLogin = localStorage.getItem("nameGhoste")
          
        //   socket.send(JSON.stringify({
        //     action: "auth",
        //     data: {
        //       isAutowebinar: isAutowebinar,
        //       type: auth.type,
        //       authData: auth.data,
        //       login: strLogin,
        //       chat: String(this.webinarId),
        //       device: String(navigator.userAgent?.toLowerCase()),
        //       msg: this.comment,
        //       room: this.webinarId,
        //       timestamp: moment().tz('Europe/Moscow'), // Date.now(),
        //     }
        //   }))
        // };

        socket.onmessage = async (event) => {
          const command = JSON.parse(event.data)
          if (command.action == "ping") {
            console.log("ping")
            let strLogin = 'User'
            if(localStorage.getItem("login")) strLogin = localStorage.getItem("login")
            else strLogin = localStorage.getItem("nameGhoste")
            
            const date = new Date()
            const dbDate = new Date(this.dateStart)
            const offset = date.getTimezoneOffset() 
            const now = date.getTime() + (offset * 60000)
            let dateStart = dbDate.getTime() + (offset* 60000)

            const tempDiff = dateStart - now

            if (tempDiff < 0) {
              let temp = 0;
              if (this.playbackFrequency == "1min") 
                temp = 60 * 1000
              else if (this.playbackFrequency == '5min')
                temp = 5 * 60 * 1000
              else if (this.playbackFrequency == '10min')
                temp = 10 * 60 * 1000
              else if (this.playbackFrequency == '30min')
                temp = 30 * 60 * 1000
              else if (this.playbackFrequency == '1hour')
                temp = 3600 * 1000
              else if (this.playbackFrequency == '6hour')
                temp = 6 * 3600 * 1000
              else if (this.playbackFrequency == '12hour')
                temp = 12 * 3600 * 1000
              else
                temp = 24 * 3600 * 1000

              if (localStorage.getItem('roomNumber')) {
                this.roomNumber = Math.floor(localStorage.getItem('roomNumber'))
              } else {
                this.roomNumber = Math.floor(Math.abs(tempDiff / temp))
                localStorage.setItem('roomNumber', this.roomNumber)
              }
            }

            socket.send(JSON.stringify({
              action: "auth",
              data: {
                isAutowebinar: isAutowebinar,
                type: auth.type,
                authData: auth.data,
                login: strLogin,
                chat: String(this.webinarId),
                device: String(navigator.userAgent?.toLowerCase()),
                msg: this.comment,
                room: this.webinarId,
                state: !this.startState ? 0 : 1 ,
                roomData: this.webinarData,
                roomNumber: this.roomNumber,
                timestamp: moment().tz('Europe/Moscow'), // Date.now(),
              }
            }))
          }
          if (command.action == "authed") {
            console.log("authed")
            if (this.videoType) {
              testPlayer = videojs('video-player', {
                techOrder: ['html5', 'flvjs'],
                flvjs: {
                  mediaDataSource: {
                    isLive: true,
                    cors: true,
                    withCredentials: false,
                  },
                }
              });
            } else {
              testPlayer = videojs('video-player')
            }
            testPlayer.on('error', function() {
            const errorDisplay = testPlayer.getChild('errorDisplay');
              if (errorDisplay) {
                errorDisplay.hide(); // Hide the default error display
              }
            });

            const videoPlayer = document.getElementById('video-player');
            const sourceElement = videoPlayer.querySelector('source');
            sourceElement.src = this.videoSrc;
            if (this.videoType) {
              testPlayer.src({ type: 'video/x-flv', src: this.videoSrc });
              if (flvjs.isSupported()) {
                videojs.getTech('Html5').registerSourceHandler({
                  canHandleSource: function (source) {
                    return source.type === 'video/x-flv' ? 'probably' : '';
                  },
                  handleSource: function (source, tech) {
                    // Configure FLV.js player and enable buffering settings
                    flvPlayer = flvjs.createPlayer({
                      type: 'flv',
                      url: source.src,
                      isLive: false,
                    });
                    flvPlayer.attachMediaElement(tech.el());
                    flvPlayer.load();
                  },
                }, 0);
              }

            } else {
              testPlayer.src({ type: 'video/mp4', src: this.videoSrc });
            }

            let customChattingLinks = null
            if (this.sendLinks.length !== 0) {
              customChattingLinks = document.getElementById("chatLinks")
              if (customChattingLinks) {
                if (this.sendLinks.length === 1) {
                  customChattingLinks.style.minHeight = '50px'
                  customChattingLinks.style.maxHeight = '50px'
                } else if (this.sendLinks.length === 2) {
                  customChattingLinks.style.minHeight = '88px'
                  customChattingLinks.style.maxHeight = '88px'
                } else if (this.sendLinks.length >= 3) {
                  customChattingLinks.style.minHeight = '135px'
                  customChattingLinks.style.maxHeight = '135px'
                }
              }
              const chatingLinks = document.querySelector(".chating_links")
              if (chatingLinks) {
                chatingLinks.scrollTop = chatingLinks.scrollHeight;
              }
            }
            let users = 1
            if (localStorage.getItem("nameGhoste") && localStorage.getItem("nameGhoste").includes('победитель')) {
              if (command.data.users) {
                users = command.data.users
              }
              localStorage.setItem("nameGhoste", 'победитель' + users)
            }   

            // if (
            //   this.isAdmin
            //   && this.comment?.trim()
            //   && (
            //     !this.items.length || (
            //       this.items[0].msg.trim() !== this.comment.trim()
            //       || this.items[0].user.auth.id !== this.webinar.userId
            //     )
            //   )
            // ) {
            //   this.socket.send(JSON.stringify({
            //     action: "sendZakrepComment",
            //     data: {
            //       isAutowebinar: isAutowebinar,
            //       chat: String(this.webinarId),
            //       device: String(navigator.userAgent?.toLowerCase()),
            //       msg: this.comment,
            //       room: this.webinarId,
            //       timestamp: moment().tz('Europe/Moscow'), // Date.now(),
            //     }
            //   }))
            // }
            this.$forceUpdate()
            // this.timer()

            if (this.screensaverPhoto) {
              document.getElementById("black").style.backgroundImage = "url("+this.$config.staticURL + "/" + this.screensaverPhoto+")"
              if (this.screensaverAudio) {
                console.log("audio====>", this.screensaverAudio)
                document.getElementById("screensaverAudio").src = this.$config.staticURL + "/" + this.screensaverAudio
                document.getElementById("screensaverAudio").play()
                document.getElementById("screensaverAudio").addEventListener('play', () => this.audioPlayerStatus = true);
                document.getElementById("screensaverAudio").addEventListener('pause', () => this.audioPlayerStatus = false);
              }
            } else if (this.screensaverAudio) {
              console.log("audio====>", this.screensaverAudio)
              // this.newAudio = new Audio(this.$config.staticURL + '/' + this.screensaverAudio)
              // this.newAudio.loop = true;
              // this.newAudio.play()
              document.getElementById("black").style.backgroundImage = "url("+this.$config.staticURL + "/defaultSplashImage.jpg)"
              document.getElementById("screensaverAudio").src = this.$config.staticURL + "/" + this.screensaverAudio
              document.getElementById("screensaverAudio").play()
              document.getElementById("screensaverAudio").addEventListener('play', () => this.audioPlayerStatus = true);
              document.getElementById("screensaverAudio").addEventListener('pause', () => this.audioPlayerStatus = false);
            } else if (this.screensaverVideo) {
              document.getElementById('screensaverVideo').style.display = 'block';
              document.getElementById('screen__overlay').style.display = 'block';
              rt = new Rutube();

              console.log(rt)

              rt.Player('screensaverVideo', {
                width: document.getElementById('screensaverVideo').offsetWidth,
                height: document.getElementById('screensaverVideo').offsetHeight,
                videoId: this.screensaverVideo,
                "events": {
                  "onReady": onPlayerReady,
                  "onStateChange": onPlayerStateChange
                }
              });

              function onPlayerReady(event) {
                console.log('Плеер загружен.');
                console.log(event); // { videoId: '6e5e06ad0f3104ae47fb0f69d2198855', clientId: 'e56df991-ca59-4036-91b8-e2913944f84c' }

                setTimeout(rt.play(), 700);
                
                setTimeout(function() {
                  document.getElementById('screen__overlay').style.display = 'none'
                }, 2000)

                setTimeout(rt.unMute(), 5000);
              }

              function onPlayerStateChange(event) {
                if (event.playerState.PAUSED) {
                  document.getElementById('screen__overlay').style.display = 'block';
                  console.log('PAUSED');
                  console.log(rt.currentDuration()); // 41.635709
                }

                if (event.playerState.ENDED) {
                  console.log('ENDED');

                  // если текущее видео закончилось, переход к другому с ID d124f6d7c977b94031051409aa55648a
                  // rt.changeVideo({
                  //   id: 'd124f6d7c977b94031051409aa55648a',
                  // });
                }

                // if (event.playerState.PLAYING && !jumpToSeek) {
                //   rt.seekTo({ time: 124 });
                //   jumpToSeek = true;
                // }
              }

              const rutubeIframe = document.getElementById('rt-screensaverVideo');
              const container = document.getElementById('screensaverVideo');

              // Set the iframe to match the parent size
              function adjustIframeSize() {
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;

                rutubeIframe.style.width = containerWidth + 'px';
                rutubeIframe.style.height = containerHeight + 'px';
              }

              // Adjust the iframe size on window resize
              window.addEventListener('resize', adjustIframeSize);

              // Also run once to adjust on page load
              adjustIframeSize();

              // Optionally, use ResizeObserver if the container size changes dynamically
              const resizeObserver = new ResizeObserver(() => {
                adjustIframeSize();
              });

              resizeObserver.observe(container);

            } else {
              document.getElementById("black").style.backgroundImage = "url("+this.$config.staticURL + "/defaultSplashImage.jpg)"
            }
            const date = new Date()
            const dbDate = new Date(this.dateStart)
            const offset = date.getTimezoneOffset() 
            const now = date.getTime() + (offset * 60000)
            let dateStart = dbDate.getTime() + (offset* 60000)

            const tempDiff = dateStart - now

            console.log(tempDiff)

            if (this.isActive) {
              const savedTime = localStorage.getItem('playerUpdateTime');
              let roomId = localStorage.getItem('roomId')
              if (savedTime && savedTime != 0 && (String(roomId) === String(this.webinarId))) {
                await this.start()
              } else {
	      
                if (tempDiff < 0) {
                  if (!this.isAutoWebinar) {
                    // this.enableWebinar(this.webinarId, 1, this.isAutoWebinar)
                    // this.socket.send(JSON.stringify({
                    //   action: "startStream",
                    //   data: {
                    //     isAutowebinar: this.isAutoWebinar,
                    //     chat: String(this.webinarId), // this.$route.params.id,
                    //     playTime: moment().tz('Europe/Moscow'),
                    //   }
                    // }))
                    if (this.status) {
                      this.playTime = this.dateStart
                      this.start()
                    } else {
                      if (this.isAdmin || this.isModer) {
                        this.dateStartPole = "Нажмите на кнопку «Начать трансляцию»!"
                      } else {
                        this.dateStartPole = "Ожидание начала эфира от ведущего"
                      }
                    }
                    
                  } else {
                    let temp = 0;
                    console.log(this.playbackFrequency)
                    if (this.playbackFrequency == "1min") 
                      temp = 60 * 1000
                    else if (this.playbackFrequency == '5min')
                      temp = 5 * 60 * 1000
                    else if (this.playbackFrequency == '10min')
                      temp = 10 * 60 * 1000
                    else if (this.playbackFrequency == '30min')
                      temp = 30 * 60 * 1000
                    else if (this.playbackFrequency == '1hour')
                      temp = 3600 * 1000
                    else if (this.playbackFrequency == '6hour')
                      temp = 6 * 3600 * 1000
                    else if (this.playbackFrequency == '12hour')
                      temp = 12 * 3600 * 1000
                    else
                      temp = 24 * 3600 * 1000

                    if (Math.floor(Math.abs(tempDiff / temp)) >= 0 ) {
                      this.dateStart = new Date(dateStart + 180 * 60000 + (Math.floor(Math.abs(tempDiff / temp)) + 1) * temp) 
                    }

                    setInterval(()=> {
                      const date = new Date()
                      const offset = date.getTimezoneOffset() 
                      const utc = date.getTime() + (offset * 60000)
                      
                      const now = new Date(utc + 180 * 60000)
                      let dateStart = this.dateStart
                      const diff = dateStart - now
                      if (diff >= 0 && diff < 1000) {
                        this.dateStartPole = "В эфире"
                        if (this.isAdmin || this.isModer) {
                          let roomData = this.$store.state.roomData
                          if (roomData?.roomId !== this.webinarId) {
                            roomData = {
                              isAutowebinar: isAutowebinar,
                              roomId: this.webinarId, 
                              playTime: moment().tz('Europe/Moscow')
                            }
                            this.$store.commit('setRoomData', roomData);
                          }
                          // this.socket.send(JSON.stringify({
                          //   action: "startStream",
                          //   data: {
                          //     isAutowebinar: isAutowebinar,
                          //     chat: String(this.webinarId), // this.$route.params.id,
                          //     playTime: roomData.playTime,
                          //   }
                          // }))
                          this.start()
                        } else { 
                          this.start()
                        }
                        clearInterval()
                        return
                      } 
                      if (diff > 1000) {
                        let dayDiff = 0
                        let dayDiffText = ""
                        let hDisplay = ""
                        let hDiff = diff / 1000 / 3600
                        if (hDiff > 24) {
                          dayDiff = Math.floor(hDiff/24)
                          if (dayDiff === 1) {
                            dayDiffText = dayDiff + " день "
                          } else if (dayDiff > 1 && dayDiff < 5) {
                            dayDiffText = dayDiff + " дня "
                          } else if (dayDiff > 4) {
                            dayDiffText = dayDiff + " дней "
                          }
                          // hDiff = Math.floor(hDiff%24)
                          hDisplay = Math.floor(hDiff%24) < 10 ? ("0" + Math.floor(hDiff%24)) : Math.floor(hDiff%24)
                        } else {
                          hDisplay = Math.floor(hDiff) < 10 ? ("0" + Math.floor(hDiff)) : Math.floor(hDiff)
                        }
                        const minDiff = (diff - Math.floor(hDiff) * 1000 * 3600) / 1000 / 60
                        const minDisplay = Math.floor(minDiff) < 10 ? ("0" + Math.floor(minDiff)) : Math.floor(minDiff)
                        const secDiff = (diff - Math.floor(hDiff) * 1000 * 3600 - Math.floor(minDiff) * 60 * 1000) / 1000
                        const secDisplay = Math.floor(secDiff) < 10 ? ("0" + Math.floor(secDiff)) : Math.floor(secDiff)
                        this.dateStartPole = "Начало через " + dayDiffText + hDisplay + ":" + minDisplay + ":" + secDisplay
                        return
                      }
                    }, 1000)

                  }
                } else {
                  this.enableWebinar(this.webinarId, 0, this.isAutoWebinar)
                  setInterval(()=> {
                    const date = new Date()
                    const dbDate = new Date(this.dateStart)
                    const offset = date.getTimezoneOffset() 
                    const now = date.getTime() + (offset * 60000)
                    const dateStart = dbDate.getTime() + (offset* 60000)
                  
                    const diff = dateStart - now

                    if (diff >= 0 && diff < 1000) {
                      clearInterval()
                      if (this.isAdmin || this.isModer) {
                        let roomData = this.$store.state.roomData
                        if (roomData?.roomId !== this.webinarId) {
                          roomData = {
                            isAutowebinar: isAutowebinar,
                            roomId: this.webinarId, 
                            playTime: moment().tz('Europe/Moscow')
                          }
                          this.$store.commit('setRoomData', roomData);
                        }
                        if (!this.isAutoWebinar) {
                          this.dateStartPole = "Нажмите на кнопку «Начать трансляцию»!"
                        } else {
                          this.dateStartPole = "В эфире"
                          this.socket.send(JSON.stringify({
                            action: "startStream",
                            data: {
                              isAutowebinar: isAutowebinar,
                              chat: String(this.webinarId), // this.$route.params.id,
                              playTime: roomData.playTime,
                            }
                          }))
                        }
                        // await this.start()
                      } else {
                        if (!this.isAutoWebinar) {
                          this.dateStartPole = "Ожидание начала эфира от ведущего"
                        } else {
                          this.dateStartPole = "В эфире"
                          this.start()
                        }
                      }
                      return
                    } 
                    if (diff > 1000) {
                      let dayDiff = 0
                      let dayDiffText = ""
                      let hDisplay = ""
                      let hDiff = diff / 1000 / 3600
                      if (hDiff > 24) {
                        dayDiff = Math.floor(hDiff/24)
                        if (dayDiff === 1) {
                          dayDiffText = dayDiff + " день "
                        } else if (dayDiff > 1 && dayDiff < 5) {
                          dayDiffText = dayDiff + " дня "
                        } else if (dayDiff > 4) {
                          dayDiffText = dayDiff + " дней "
                        }
                        // hDiff = Math.floor(hDiff%24)
                        hDisplay = Math.floor(hDiff%24) < 10 ? ("0" + Math.floor(hDiff%24)) : Math.floor(hDiff%24)
                      } else {
                        hDisplay = Math.floor(hDiff) < 10 ? ("0" + Math.floor(hDiff)) : Math.floor(hDiff)
                      }
                      const minDiff = (diff - Math.floor(hDiff) * 1000 * 3600) / 1000 / 60
                      const minDisplay = Math.floor(minDiff) < 10 ? ("0" + Math.floor(minDiff)) : Math.floor(minDiff)
                      const secDiff = (diff - Math.floor(hDiff) * 1000 * 3600 - Math.floor(minDiff) * 60 * 1000) / 1000
                      const secDisplay = Math.floor(secDiff) < 10 ? ("0" + Math.floor(secDiff)) : Math.floor(secDiff)
                      this.dateStartPole = "Начало через " + dayDiffText + hDisplay + ":" + minDisplay + ":" + secDisplay
                      return
                    }
                  }, 1000)
                }
              }
            } else {
              this.dateStartPole = "На данный момент вебинар недоступен"
            }
            
            // if (this.videoType) {
            //   testPlayer = videojs('video-player', {
            //     techOrder: ['html5', 'flvjs'],
            //     flvjs: {
            //       mediaDataSource: {
            //         isLive: true,
            //         cors: true,
            //         withCredentials: false,
            //       },
            //     }
            //   });
            // // testPlayer = videojs('video-player');
            // } else {
            //   testPlayer = videojs('video-player');
            // }
            // testPlayer.on('error', function() {
            // const errorDisplay = testPlayer.getChild('errorDisplay');
            //   if (errorDisplay) {
            //     errorDisplay.hide(); // Hide the default error display
            //   }
            // });
            localStorage.setItem('roomId', this.webinarId)
            socket.send(JSON.stringify({
              action: "join",
              data: {
                isAutowebinar: isAutowebinar,
                chat: String(this.webinarId), // this.$route.params.id
                roomNumber: this.roomNumber
              }
            }))  

          }

          if (command.action == "updateRoom") {
            console.log("updateRoom", command.data.roomData)
            const data = command.data.roomData
            this.webinarData = data
            this.isActive = data.isActive
            this.webinarId = data.id
            this.url = data.url
            this.userDescription = data.userDescription
            // this.authorStatus = data.userStatus
            // this.authorName = data.userName
            // this.title = data.title
            const newData = {
              roomTitle: data.title,
              authorStatus: data.userStatus,
              authorName: data.userName,
            }
            this.$store.commit('updateRoom', newData);
            
            this.comment = data.comment
            this.commentData = data.commentData
            if (this.comment !== '' && this.comment !== null) {
              var parseData = {
                msg: this.comment,
                user: JSON.parse(this.commentData)
              }
              this.pinItems.pop()
              this.pinItems.push(parseData)
            }
            
            this.dateStart = data.dateStart
            this.playbackFrequency = data.playbackFrequency
            this.background = this.$config.staticURL + '/' + data.backgroundIn
            if (data.userAvatar !== '' && data.userAvatar !== null) {
              this.authorAvatar = this.$config.staticURL + '/' + data.userAvatar
            } else {
              this.authorAvatar = `/author__photo.png`
            }
            this.redirectOut = (data.redirectOut == "") ? "https://neearby.pro" : data.redirectOut

            const banWords = data.banWords?.split('; ')

            if (banWords?.length && banWords[0]) {
              this.banWords = banWords
            }

            if (data.backgroundImageInside) {
              
              var temp = data.backgroundImageInside.substr(data.backgroundImageInside.length - 5, 1);
              this.darkMode = temp >= 3 ?  true : false; 

              this.backgroundImage = {
                'background-image': `url('${this.$config.staticURL + '/' + data.backgroundImageInside}')`,
              }
              //  'background-size': '100% auto',
            }

            this.isBlockChatBeforeStart = (data.blockChatBeforeStart === 'Y') ? true : false
            if (!this.status) {
              if (data.blockedChat === 'Y' || (data.blockChatBeforeStart === 'Y')) {
                this.isBlockChat = true
              } else if (data.blockedChat === 'N' && (data.blockChatBeforeStart === 'N')) {
                this.isBlockChat = false
              }
            } else {
              if (data.blockedChat === 'Y') {
                this.isBlockChat = true
              } else if (data.blockedChat === 'N') {
                this.isBlockChat = false
              }
            }

            this.notificationSoundAddLink = (data.addLinkNotificationSound === 'Y') ? true : false
            console.log(data.links)
            this.links = []
            this.links = (data.links !== "[]") ? data.links : []
            console.log(this.links)
            this.isAdmin = this.user.id == data.userId
            this.isModer = data?.moderators?.includes(this.user.id)
            this.duration = (data.duration !== null || data.duration !== 0) ? data.duration : 0  
            this.allowChatLinks = (data?.allowChatLinks === 'Y') ? true : false
            this.playback = !this.isAutoWebinar ? data.playback : this.playback

            const date = new Date()
            const dbDate = new Date(this.dateStart)
            const offset = date.getTimezoneOffset() 
            const now = date.getTime() + (offset * 60000)
            let dateStart = dbDate.getTime() + (offset* 60000)

            const tempDiff = dateStart - now

            console.log(tempDiff)

            if (this.isActive) {
              if (tempDiff < 0) {
                if (!this.isAutoWebinar) {
                  // this.enableWebinar(this.webinarId, 1, this.isAutoWebinar)
                  // this.socket.send(JSON.stringify({
                  //   action: "startStream",
                  //   data: {
                  //     isAutowebinar: this.isAutoWebinar,
                  //     chat: String(this.webinarId), // this.$route.params.id,
                  //     playTime: moment().tz('Europe/Moscow'),
                  //   }
                  // }))
                  if (this.status) {
                    this.playTime = this.dateStart
                    this.start()
                  } else {
                    if (this.isAdmin || this.isModer) {
                      this.dateStartPole = "Нажмите на кнопку «Начать трансляцию»!"
                    } else {
                      this.dateStartPole = "Ожидание начала эфира от ведущего"
                    }
                  }
                  
                } else {
                  let temp = 0;
                  if (this.playbackFrequency == "1min") 
                    temp = 60 * 1000
                  else if (this.playbackFrequency == '5min')
                    temp = 5 * 60 * 1000
                  else if (this.playbackFrequency == '10min')
                    temp = 10 * 60 * 1000
                  else if (this.playbackFrequency == '30min')
                    temp = 30 * 60 * 1000
                  else if (this.playbackFrequency == '1hour')
                    temp = 3600 * 1000
                  else if (this.playbackFrequency == '6hour')
                    temp = 6 * 3600 * 1000
                  else if (this.playbackFrequency == '12hour')
                    temp = 12 * 3600 * 1000
                  else
                    temp = 24 * 3600 * 1000
                  
                  if (Math.floor(Math.abs(tempDiff / temp)) > 0 ) {
                    this.dateStart = new Date(dateStart + 180 * 60000 + (Math.floor(Math.abs(tempDiff / temp)) + 1) * temp) 
                  }

                  setInterval(()=> {
                    const date = new Date()
                    const offset = date.getTimezoneOffset() 
                    const utc = date.getTime() + (offset * 60000)
                    
                    const now = new Date(utc + 180 * 60000)
                    let dateStart = this.dateStart
                    const diff = dateStart - now

                    if (diff >= 0 && diff < 1000) {
                      this.dateStartPole = "В эфире"
                      if (this.isAdmin || this.isModer) {
                        let roomData = this.$store.state.roomData
                        if (roomData?.roomId !== this.webinarId) {
                          roomData = {
                            isAutowebinar: isAutowebinar,
                            roomId: this.webinarId, 
                            playTime: moment().tz('Europe/Moscow')
                          }
                          this.$store.commit('setRoomData', roomData);
                        }
                        this.socket.send(JSON.stringify({
                          action: "startStream",
                          data: {
                            isAutowebinar: isAutowebinar,
                            chat: String(this.webinarId), // this.$route.params.id,
                            playTime: roomData.playTime,
                          }
                        }))
                        // await this.start()
                      } else { 
                        this.start()
                      }
                      clearInterval()
                      return
                    } 
                    if (diff > 1000) {
                      let dayDiff = 0
                      let dayDiffText = ""
                      let hDisplay = ""
                      let hDiff = diff / 1000 / 3600
                      if (hDiff > 24) {
                        dayDiff = Math.floor(hDiff/24)
                        if (dayDiff === 1) {
                          dayDiffText = dayDiff + " день "
                        } else if (dayDiff > 1 && dayDiff < 5) {
                          dayDiffText = dayDiff + " дня "
                        } else if (dayDiff > 4) {
                          dayDiffText = dayDiff + " дней "
                        }
                        // hDiff = Math.floor(hDiff%24)
                        hDisplay = Math.floor(hDiff%24) < 10 ? ("0" + Math.floor(hDiff%24)) : Math.floor(hDiff%24)
                      } else {
                        hDisplay = Math.floor(hDiff) < 10 ? ("0" + Math.floor(hDiff)) : Math.floor(hDiff)
                      }
                      const minDiff = (diff - Math.floor(hDiff) * 1000 * 3600) / 1000 / 60
                      const minDisplay = Math.floor(minDiff) < 10 ? ("0" + Math.floor(minDiff)) : Math.floor(minDiff)
                      const secDiff = (diff - Math.floor(hDiff) * 1000 * 3600 - Math.floor(minDiff) * 60 * 1000) / 1000
                      const secDisplay = Math.floor(secDiff) < 10 ? ("0" + Math.floor(secDiff)) : Math.floor(secDiff)
                      this.dateStartPole = "Начало через " + dayDiffText + hDisplay + ":" + minDisplay + ":" + secDisplay
                      return
                    }
                  }, 1000)

                }
              } else {
                this.enableWebinar(this.webinarId, 0, this.isAutoWebinar)
                setInterval(()=> {
                  const date = new Date()
                  const dbDate = new Date(this.dateStart)
                  const offset = date.getTimezoneOffset() 
                  const now = date.getTime() + (offset * 60000)
                  const dateStart = dbDate.getTime() + (offset* 60000)
                
                  const diff = dateStart - now

                  if (diff >= 0 && diff < 1000) {
                    clearInterval()
                    if (this.isAdmin || this.isModer) {
                      let roomData = this.$store.state.roomData
                      if (roomData?.roomId !== this.webinarId) {
                        roomData = {
                          isAutowebinar: isAutowebinar,
                          roomId: this.webinarId, 
                          playTime: moment().tz('Europe/Moscow')
                        }
                        this.$store.commit('setRoomData', roomData);
                      }
                      if (!this.isAutoWebinar) {
                        this.dateStartPole = "Нажмите на кнопку «Начать трансляцию»!"
                      } else {
                        this.dateStartPole = "В эфире"
                        this.socket.send(JSON.stringify({
                          action: "startStream",
                          data: {
                            isAutowebinar: isAutowebinar,
                            chat: String(this.webinarId), // this.$route.params.id,
                            playTime: roomData.playTime,
                          }
                        }))
                      }
                      // await this.start()
                    } else {
                      if (!this.isAutoWebinar) {
                        this.dateStartPole = "Ожидание начала эфира от ведущего"
                      } else {
                        this.dateStartPole = "В эфире"
                        this.start()
                      }
                    }
                    return
                  } 
                  if (diff > 1000) {
                    let dayDiff = 0
                    let dayDiffText = ""
                    let hDisplay = ""
                    let hDiff = diff / 1000 / 3600
                    if (hDiff > 24) {
                      dayDiff = Math.floor(hDiff/24)
                      if (dayDiff === 1) {
                        dayDiffText = dayDiff + " день "
                      } else if (dayDiff > 1 && dayDiff < 5) {
                        dayDiffText = dayDiff + " дня "
                      } else if (dayDiff > 4) {
                        dayDiffText = dayDiff + " дней "
                      }
                      // hDiff = Math.floor(hDiff%24)
                      hDisplay = Math.floor(hDiff%24) < 10 ? ("0" + Math.floor(hDiff%24)) : Math.floor(hDiff%24)
                    } else {
                      hDisplay = Math.floor(hDiff) < 10 ? ("0" + Math.floor(hDiff)) : Math.floor(hDiff)
                    }
                    const minDiff = (diff - Math.floor(hDiff) * 1000 * 3600) / 1000 / 60
                    const minDisplay = Math.floor(minDiff) < 10 ? ("0" + Math.floor(minDiff)) : Math.floor(minDiff)
                    const secDiff = (diff - Math.floor(hDiff) * 1000 * 3600 - Math.floor(minDiff) * 60 * 1000) / 1000
                    const secDisplay = Math.floor(secDiff) < 10 ? ("0" + Math.floor(secDiff)) : Math.floor(secDiff)
                    this.dateStartPole = "Начало через " + dayDiffText + hDisplay + ":" + minDisplay + ":" + secDisplay
                    return
                  }
                }, 1000)
              }
            } else {
              this.dateStartPole = "На данный момент вебинар недоступен"
            }
          }

          if (command.action == "changeInsideBackground") {
            let value = command.data.background
            var temp = value.substr(value.length - 5, 1);
            this.darkMode = temp >= 3 ? true : false;
            if (this.backgroundImage?.['background-image'] !== `url('${this.$config.staticURL + '/' + value}')`) {
              this.backgroundImage = {
                'background-image': `url('${this.$config.staticURL + '/' + value}')`,
                'background-size': '100% 100%',
              }
            }
            this.$forceUpdate()
          }
          
          if (command.action == "showScreen") {
            console.log(command.data.msg)
            const msg = command.data.msg
            this.isCenterLink = false
            document.getElementById('rightMessage').style.display = 'flex'
            if (msg.user.type === 'token') {
              this.messageUserAvatar = this.authorAvatar
            } else {
              this.messageUserAvatar = ''
            }

            this.messageUsername = msg.user.auth.name
            this.messageContent = msg.msg

            if (command.data.status === 'pin' && this.comment) {
              this.pinComment = 'Сообщение закреплено'
            } else {
              this.pinComment = ''
            }

            setTimeout(() => {
              document.getElementById('rightMessage').style.display = 'none'
            }, 30000);
              
          }

          if (command.action == "pinMessage") {
            // this.items.filter((item) => {
            //   return item.user.timestamp == command.data.pinMessage.user.timestamp
            // })
            console.log("pinnnnnnnnnnnnnnnnnn", command.data.pinMessage)
            console.log(this.items)
            this.items = this.items.filter(item => this.checkPinRule(item, command.data.pinMessage));
            console.log("filter", this.items)
            if (command.data.pinedMessage.length !== 0) {
              this.items.push(command.data.pinedMessage[0])
            }

            this.items.sort((a, b) => new Date(a.user.timestamp) - new Date(b.user.timestamp))
            
            this.pinItems.pop()
            this.pinItems.push(command.data.pinMessage)
            console.log(this.pinItems)
          }

          if (command.action == "unpinMessage") {
            console.log("unpinMessage")
            this.items.push(command.data.msg)
            this.items.sort((a, b) => new Date(a.user.timestamp) - new Date(b.user.timestamp))
            this.pinItems.pop()
            console.log(this.pinItems)
          }

          if (command.action == "pinMessageEvent") {
            let eventPinMessage = null
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].msg === command.data.msg) {
                if (this.items[i].user.auth.login === command.data.user.auth.login) {
                  if (this.items[i].user.timestamp === command.data.user.timestamp) {
                    eventPinMessage = this.items[i]
                  }
                }
              }
            }
            console.log(eventPinMessage)
            if (eventPinMessage) {
              this.socket.send(JSON.stringify({
                action: "eventPinMessage",
                data: {
                  pinMessage: eventPinMessage,
                  pinedMessage: this.pinItems,
                  isAutowebinar: isAutowebinar,
                  chat: String(this.webinarId),
                  roomNumber: this.roomNumber,
                }
              }))
            }
          }

          if (command.action == "updateInfo") {
            // if (!this.isAutoWebinar) {
              this.chatNumber = command.data.users
            // }
          }

          if (command.action == "message") {
            console.log(command.data)
            var flag = 0
            if (command.data.user.color && command.data.user.color.includes('#') 
                  && command.data.msg && this.isLink(command.data.msg) ) {
              for (let i = 0; i < this.sendLinks.length; i++) {
                if (this.sendLinks[i].msgLink === command.data.msg ) {
                  flag += 1;
                }
              }
              if (flag === 0) {
                this.items.push(command.data)
                this.items.sort((a, b) => new Date(a.user.timestamp) - new Date(b.user.timestamp))
                this.$forceUpdate()
              }
            } else {
              this.items.push(command.data)
              this.items.sort((a, b) => new Date(a.user.timestamp) - new Date(b.user.timestamp))
              this.$forceUpdate()
            }
            
            if (command.data.user.type !== 'link') {
              
              this.$nextTick(() => {
                const chating = document.getElementById("chating")
                chating.scrollTop = chating.scrollHeight;
              })
              
              if (command.data.user.color && command.data.user.color.includes('#') 
                  && command.data.msg && this.isLink(command.data.msg) ) {
                flag = 0;
                for (let i = 0; i < this.sendLinks.length; i++) {
                  if (this.sendLinks[i].msgLink === command.data.msg ) {
                    flag += 1;
                  }
                }
                if (flag === 0) {
                  if (this.notificationSoundAddLink) {
                    document.getElementById("linkSound").src = this.$config.staticURL + "/linkSound.mp3";
                    document.getElementById("linkSound").play();
                  }
                  this.isCenterLink = true
                  document.getElementById('rightMessage').style.display = 'none'
                  console.log("centerLink", command.data)
                  this.centerLink = {
                    username: command.data.user.name,
                    msg: command.data.msg,
                    color: command.data.user.color
                  }

                  this.sendLinks.push({
                    msgLink: command.data.msg,
                    nameLink: command.data.user.name,
                    colorLink: command.data.user.color
                  })

                  this.$nextTick(() => {
                    const chatingLinks = document.querySelector(".chating_links")
                    if (chatingLinks) {
                      chatingLinks.scrollTop = chatingLinks.scrollHeight;
                    }

                    const chating = document.getElementById("chating")
                    chating.scrollTop = chating.scrollHeight;
                  })
                  setTimeout(() => {
                    this.isCenterLink = false
                  }, 30000);
                  let secondCustomChattingLinks = null
                  if (this.sendLinks.length !== 0) {
                    secondCustomChattingLinks = document.getElementById("chatLinks")
                    // console.log(secondCustomChattingLinks)
                    if (secondCustomChattingLinks) {
                      if (this.sendLinks.length === 1) {
                        secondCustomChattingLinks.style.minHeight = '50px'
                        secondCustomChattingLinks.style.maxHeight = '50px'
                      } else if (this.sendLinks.length === 2) {
                        secondCustomChattingLinks.style.minHeight = '88px'
                        secondCustomChattingLinks.style.maxHeight = '88px'
                      } else if (this.sendLinks.length >= 3) {
                        secondCustomChattingLinks.style.minHeight = '135px'
                        secondCustomChattingLinks.style.maxHeight = '135px'
                      }
                    }
                  }
                }
              }
            } else if (command.data.user.type === 'link') {
              this.$nextTick(() => {
                const chatingLinks = document.querySelector(".chating_links")
                if (chatingLinks) {
                  chatingLinks.scrollTop = chatingLinks.scrollHeight;
                }

                const chating = document.getElementById("chating")
                chating.scrollTop = chating.scrollHeight;
              })
            }
          }

          if (command.action == 'startStream') {
            console.log("startStream")
            this.isActive = 1
            this.playTime = command.data.playTime
            this.status = 1
            this.start()
            this.isBlockChatBeforeStart = false
          }

          if (command.action == 'stopStream') {
            console.log("stopStream")
            this.leave()
          }

          if (command.action == 'editLink') {
            const editedItem = command.data

            this.items = this.items.map((item) => {
              if (
                item.msg === editedItem.oldMsg
                // || item.user.type === editedItem.user.type
                && item.user.name === editedItem.oldUser.name
                && item.user.color === editedItem.oldUser.color
              ) {
                let tempItem = item
                tempItem.msg = editedItem.msg
                tempItem.user.name = editedItem.user.name
                tempItem.user.color = editedItem.user.color
                return tempItem
              }
              return item
            })

            this.sendLinks = this.sendLinks.map((item) => {
              if (
                item.msgLink === editedItem.oldMsg
                // || item.user.type === editedItem.user.type
                && item.nameLink === editedItem.oldUser.name
                && item.colorLink === editedItem.oldUser.color
              ) {
                let tempItem = item
                tempItem.msgLink = editedItem.msg
                tempItem.nameLink = editedItem.user.name
                tempItem.colorLink = editedItem.user.color
                return tempItem
              }
              return item
            })

            if (this.isCenterLink) {
              if (this.centerLink.msg === editedItem.oldMsg && this.centerLink.color === editedItem.oldUser.color) {
                this.centerLink.msg = editedItem.msg
                this.centerLink.color = editedItem.user.color
              }
            }

            this.$forceUpdate()
          }

          if (command.action == 'deleteLink') {
            console.log("deleteLink")
            const deletedItem = command.data
            // this.items = this.items.filter((item) => {
            //   return (
            //     item.msg !== deletedItem.msg
            //     || item.user.type !== deletedItem.user.type
            //     || item.user.name !== deletedItem.user.name
            //     || item.user.color !== deletedItem.user.color
            //   )
            // })

            this.items = this.items.filter((item) => {
              return (
                !(item.msg === deletedItem.msg
                && item.user.name === deletedItem.user.name
                && item.user.color === deletedItem.user.color))})

            this.sendLinks = this.sendLinks.filter((item) => {
              return (
                !(item.msgLink === deletedItem.msg
                && item.nameLink === deletedItem.user.name
                && item.colorLink === deletedItem.user.color))})
            this.isCenterLink = false
            this.$forceUpdate()
          }

          if (command.action == 'deleteMessages') {
            const deletedItems = command.data.messages

            this.items = this.items.filter((item) => {
              return !deletedItems.some((d) => {
                return (
                  d.msg === item.msg
                  && JSON.stringify(d.user) === JSON.stringify(item.user)
                )
              })
            })

            this.sendLinks = this.sendLinks.filter((item) => {
              return !deletedItems.some((d) => {
                return (
                  d.msg === item.msgLink
                  && d.user.name === item.nameLink
                  && d.user.color === item.colorLink
                )
              })
            })

            console.log("deleteItems=====>", deletedItems)
            console.log("sendLinks=======>", this.sendLinks)

            this.$forceUpdate()
          }

          if (command.action == 'deleteEventMessage') {

            this.items = this.items.filter((item) => {
              return (
                command.data.msg !== item.msg
                &&  command.data.login !== item.user.login
              )
            })
            this.$forceUpdate()
          }

          if (command.action == 'deleteMessagesAndBanUser') {
            const bannedUsers = command.data.bannedUsers

            this.items = this.items.filter((item) => {
              return !bannedUsers.some((bu) => {
                return (
                  bu.ip === item.user.ip
                  && bu.device === item.user.device
                )
              })
            })

            this.$forceUpdate()
          }

          if (command.action == 'banUser') {
            this.iBanned = true

            this.$forceUpdate()
          }

          if (command.action == 'chatBlock') {
            this.isBlockChat = true
            console.log("isBLockChat", this.isBlockChat)

            this.$forceUpdate()
          }

          if (command.action == 'chatUnBlock') {
            this.isBlockChat = false
            this.isBlockChatBeforeStart = false
            this.$forceUpdate()
          }

          if (command.action == 'allowChatLinks') {
            this.allowChatLinks = true

            this.$forceUpdate()
          }

          if (command.action == 'disallowChatLinks') {
            this.allowChatLinks = false

            this.$forceUpdate()
          }

          if (command.action == 'clearChat') {
            this.items = this.items.filter((item) => item.user.type === 'link')
            this.sendLinks = []
            this.pinItems = []
            this.isCenterLink = false
            document.getElementById('rightMessage').style.display = "none"

            this.$forceUpdate()
          }

          if (command.action == 'addAction') {
            this.addAction(command.data)
          }

          if (command.action == 'sendHeart') {
            this.randomHeart()
          }
        };

        this.socket = socket

        
      })
    
    // console.log('screensaverVideo: ', this.webinar.screensaverVideo)
    // if (this.webinar.screensaverVideo) {
    //   await this.start({
    //     preview: this.webinar.screensaverVideo
    //   })
    // }
  },
  methods: {
    // getRandomArbitrary(min, max) {
    //   return Math.floor(Math.random() * (max - min) + min);
    // },
    // startInterval() {
    //   startInterval = setInterval(() => {
    //     this.chatNumbar = this.getRandomArbitrary((this.viewersQuantityStart - this.viewersQuantityStart/10), this.viewersQuantityStart)
    //   }, 1000);
    // },
    // middleInterval() {
    //   clearInterval(startInterval)
    //   middleInterval = setInterval(() => {
    //     this.chatNumber = this.getRandomArbitrary(this.viewersQuantityStart, this.viewersQuantityMiddle)
    //   }, 1000);
    // },
    // endInterval() {
    //   clearInterval(middleInterval)
    //   endInterval = setInterval(() => {
    //     this.chatNumber = this.getRandomArbitrary(this.viewersQuantityMiddle, this.viewersQuantity)
    //   }, 1000);
    // },
    getChattingLinkClass(link) {
      if (this.windowWidth > 1920) {
        if (link.length > 60) {
          return 'smallFontSize'
        } else {
          return 'bigFontSize'
        }
      } else if (this.windowWidth > 1439 && this.windowWidth < 1921) {
        if (link.length > 25) {
          return 'smallFontSize'
        } else {
          return 'bigFontSize'
        }
      } else if (this.windowWidth > 1199 && this.windowWidth < 1440) {
        if (link.length > 20) {
          return 'smallFontSize'
        } else {
          return 'bigFontSize'
        }
      } else if (this.windowWidth > 768 && this.windowWidth < 1200) {
        if (link.length > 10) {
          return 'smallFontSize'
        } else {
          return 'bigFontSize'
        }
      } else {
        if (link.length > 20) {
          return 'smallFontSize'
        } else {
          return 'bigFontSize'
        }
      }
    },
    getChattingLinkMsg(link) {
      if (this.windowWidth > 1920) {
        if (link.length > 60) {
          return this.cutString(link, 60)
        } else {
          return link
        }
      } else if (this.windowWidth > 1439 && this.windowWidth < 1921) {
        if (link.length > 25) {
          return this.cutString(link, 25)
        } else {
          return link
        }
      } else if (this.windowWidth > 1199 && this.windowWidth < 1440) {
        if (link.length > 20) {
          return this.cutString(link, 20)
        } else {
          return link
        }
      } else if (this.windowWidth > 768 && this.windowWidth < 1200) {
        if (link.length > 10) {
          return this.cutString(link, 10)
        } else {
          return link
        }
      } else {
        if (link.length > 20) {
          return this.cutString(link, 20)
        } else {
          return link
        }
      }
    },
    checkPinRule(item, pinMessage) {
      if (item.msg === pinMessage.msg) {
        if (item.user.auth.login === pinMessage.user.auth.login) {
          if (item.user.timestamp === pinMessage.user.timestamp) {
            return false
          } else {
            return item
          }
        } else {
          return item
        }
      } else 
        return item;
    },
    getBackgroundColor(item) {
      // ((isAdmin || isModer) && findHighlightedMessage(item)) ? 'rgba(255, 194, 138, 0.6)' : 'rgba(255, 219, 186, 0.6)'
      var adminMessage = item.user.auth.id === this.webinarData.userId ? true : false;
      var myMessage = item.user.auth.id === this.user.id ? true : false;
      if (myMessage) {
        return ((this.isAdmin || this.isModer) && this.findHighlightedMessage(item)) ? '#a6c6e1' : '#bbdefb'
      } else {
        if (adminMessage) {
          return (this.findHighlightedMessage(item)) ? 'rgba(255, 194, 138, 0.6)' : 'rgba(255, 219, 186, 0.6)'
        } else {
          return ((this.isAdmin || this.isModer) && this.findHighlightedMessage(item)) ? '#dccdcd' : '#eee'
        }
      }

    },
    closeVideoNotification() {
      
      this.videoNotification = false
    },
    closeEndWebinar() {
      this.stopState = false
    },
    closeAudioControl() {
      this.audioControl = false
    },
    audioMute() {
      console.log("audio===============>")
      this.audioControl = false
      this.videoPlayer.muted(true)
    },
    triggerBigPlayButton() {
      const bigPlayButton = this.videoPlayer.getChild('bigPlayButton');
      console.log(bigPlayButton)
      if (!this.videoPlayerError) {
        if (bigPlayButton) {
          // Programmatically click the bigPlayButton
          // bigPlayButton.el().click(); // Simulate a click event
          const clicker = setInterval(() => {
            console.log(this.videoPlayer.hasStarted())
            if (this.videoPlayer.hasStarted() === false) {
              bigPlayButton.handleClick()
            } else {
              clearInterval(clicker)
            }
          }, 1000)

          setTimeout(() => {
            if (!this.videoPlayer.hasStarted()) {
              this.videoNotification = true
            }
            console.log(this.videoNotification)
          }, 2000)
          
        } else {
            console.error('Big Play Button not found');
        }
      } else {
        this.videoPlayer.errorDisplay.contentEl().innerHTML = 'Не включен потоковая трансляция, подождите ведущего.'
        this.videoPlayer.errorDisplay.contentEl().innerText = 'Не включен потоковая трансляция, подождите ведущего.'
        const errorDisplay = this.videoPlayer.getChild('errorDisplay');
        if (errorDisplay) {
          errorDisplay.hide(); // Hide the default error display
        }
      }
    },
    async checkUserToken() {
       const data = await this.$axios.post(
          `/auth/check-user-token`,
          {
            token: localStorage.getItem("token"),
          }
        ).catch(e => {
          return false
        })
      return data;
    },
    tooltipClose() {
      this.tooltipFlag = false
    },
    async enableWebinar(webinarId, status, isAutowebinar) {
      if (!this.isAutoWebinar) {
        if (this.isAdmin || this.isModer) {
          const data = await this.$axios.$patch(
            `/webinars`, {
              id: webinarId,
              status: status,
              userId: localStorage.getItem('userId'),
              title: this.roomTitle,
              isAutowebinar: isAutowebinar,
            }, {
              headers: {
                "Authorization": localStorage.getItem('token')
              }
            }
          )

          if (data) {
            this.status = status
          }
        }
      }
    },
    async updateWebinar() {
      const date = new Date();
      date.setUTCHours(date.getUTCHours() + 3);
      this.dateStart = date.toISOString().slice(0, 16)
      const res = await this.$axios.patch(
        `/webinars`
        ,
        {
          id: this.webinarData.id,
          userId: localStorage.getItem('userId'),
          title: this.roomTitle,
          dateStart: this.dateStart,
          isAutowebinar: isAutowebinar,
        }, {
          headers: {
            "Authorization": localStorage.getItem('token')
          }
        })
    },
    isLink(strLink) {
      return strLink.includes('http')
    },
    addAction(data) {
      console.log("action===>", data)
      let action = data.action
      if (data.user.auth.id != 0) {
        action.username = data.user.auth.name 
      }
      this.actions = [
        ...this.actions,
        action
      ]
      this.actionsEmitter.emit('addAction')
    },
    addActionWS({type, msg}) {
      this.socket.send(JSON.stringify({
        action: "addAction",
        data: {
          action: {
            type,
            msg,
          },
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId),
        }
      }))
      // this.$forceUpdate()
    },
    clickCenterLink ({type, msg}) { 
      this.addActionWS({type: type, msg: msg})
      window.open(msg, '_blank');
    },
    cutString(string, length) {
      if (!string || string.length <= length) {
        return string
      }
      return string.split('').slice(0, length).join('') + '...'
    },
    getMessageTime(timestamp) {
      if (this.hideDates !== 'Y')
        return moment(timestamp).tz('Europe/Moscow').format('HH:mm')
      else 
        return ' '
    },
    deleteMessages() {
      if ((this.isAdmin || this.isModer) && this.highlightedMessages.length && this.isActive) {
        this.socket.send(JSON.stringify({
          action: "deleteMessages",
          data: {
            messages: this.highlightedMessages,
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
        this.highlightedMessages = []
        this.$forceUpdate()
      }
    },
    deleteMessagesAndBanUser() {
      if ((this.isAdmin || this.isModer) && this.highlightedMessages.length && this.isActive) {
        this.socket.send(JSON.stringify({
          action: "deleteMessagesAndBanUser",
          data: {
            messages: this.highlightedMessages,
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
        this.highlightedMessages = []
        this.$forceUpdate()
      }
    },
    ignoreUser() {
      if ((this.isAdmin || this.isModer) && this.highlightedMessages.length && this.isActive) {
        this.socket.send(JSON.stringify({
          action: "ignoreUser",
          data: {
            messages: this.highlightedMessages,
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
        this.highlightedMessages = []
        this.$forceUpdate()
      }
    },
    enableChatLinks() {
      if ((this.isAdmin || this.isModer) && this.isActive) {
        this.socket.send(JSON.stringify({
          action: "allowChatLinks",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
        this.$forceUpdate()
      }
    },
    disableChatLinks() {
      if ((this.isAdmin || this.isModer) && this.isActive) {
        this.socket.send(JSON.stringify({
          action: "disallowChatLinks",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
        this.$forceUpdate()
      }
    },
    clearChat() {
      if ((this.isAdmin || this.isModer) && this.isActive) {
        this.socket.send(JSON.stringify({
          action: "clearChat",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
        this.highlightedMessages = []
        this.$forceUpdate()
      }
    },
    findHighlightedMessage(message) {
      return this.highlightedMessages.find((m) => {
        return (
          m.msg === message.msg
          && JSON.stringify(m.user) === JSON.stringify(message.user)
        )
      })
    },
    showMenu(id) {
      // if ((this.isAdmin || this.isModer) && this.isActive) {
        this.showContextMenu = true;
        this.activeItem = id;
      // }
    },
    outsideMenu() {
      this.showContentMenu = false
      this.activeItem = ''
    },
    showScreen(message, status) {
      // if (this.isAdmin || this.isModer) {
        this.showContextMenu = false;
        this.socket.send(JSON.stringify({
          action: "showScreen",
          data: {
            message: message,
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
            status: status,
          }
        }))
      // }
    },
    pinMessage(message) {
      // if (this.isAdmin || this.isModer) {
        this.showContextMenu = false;
        this.socket.send(JSON.stringify({
          action: "pinMessage",
          data: {
            pinMessage: message,
            pinedMessage: this.pinItems,
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
            roomNumber: this.roomNumber,
          }
        }))
      // }
    },
    unpinMessage() {
      // if (this.isAdmin || this.isModer) {
        this.showContextMenu = false;
        this.socket.send(JSON.stringify({
          action: "unpinMessage",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
            message: this.pinItems[0],
            roomNumber: this.roomNumber,
          }
        }))
      // }
    },
    highlightMessage(message) {
      if ((this.isAdmin || this.isModer) && this.isActive) {
        const candidateIdx = this.highlightedMessages.findIndex((m) => {
          return (
            m.msg === message.msg
            && JSON.stringify(m.user) === JSON.stringify(message.user)
          )
        })

        if (candidateIdx !== -1) {
          this.highlightedMessages.splice(candidateIdx, 1)
          return
        }

        this.highlightedMessages.push(message)
      }
    },
    calcChatHeight() {
      // const linksLength = this.items.filter((elem) => elem.user.type === 'link').length;

      // if (this.isModer || this.isAdmin) {
      //   switch (linksLength) {
      //     case 2:
      //       return '40vh'
      //     case 1:
      //       return '50vh'
      //     case 0:
      //       return '60vh'
      //     default:
      //       return '50vh'
      //   }
      // } else {
      //   switch (linksLength) {
      //     case 2:
      //       return '40vh'
      //     case 1:
      //       return '50vh'
      //     case 0:
      //       return '60vh'
      //     default:
      //       return '50vh'
      //   }
      // }
    },
    changeInsideBackground(value) {
      
      if (this.isAdmin || this.isModer) {
        this.socket.send(JSON.stringify({
          action: "changeInsideBackground",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId), 
            background: value
          }
        }))
      } else {
        var temp = value.substr(value.length - 5, 1);
        this.darkMode = temp >= 3 ? true : false;
        if (this.backgroundImage?.['background-image'] !== `url('${this.$config.staticURL + '/' + value}')`) {
          this.backgroundImage = {
            'background-image': `url('${this.$config.staticURL + '/' + value}')`,
            'background-size': '100% 100%',
          }
        }
        this.$forceUpdate()
      }
    },
    dayNightModeMenuToggle(e) {
      e.stopPropagation()
      this.dayNightModeMenuOpen = !this.dayNightModeMenuOpen
    },
    playNotificationSoundAddLink(url) {
      if (this.audioNotification) {
        this.audioNotification.pause()
      }
      this.audioNotification = new Audio(url)
      this.audioNotification.play()
    },
    linkProps (url) {
      if (url.match(/^(http(s)?|ftp):\/\//)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    },
    openBagMoneyWaitModal() {
      this.bagMoneyWaitModalOpen = true
    },
    openBagMoneyContentModal() {
      this.bagMoneyContentModalOpen = true
    },
    openSupportModal() {
      this.supportModalOpen = true
    },
    offVolume() {
      this.volumeOff = true
      this.mute()
      this.$forceUpdate()
    },
    openLeaveRoomModal() {
      this.leaveRoomModalOpen = true
    },
    openStartStreamModal() {
      this.startStreamModalOpen = true
    },
    openStopStreamModal() {
      this.stopStreamModalOpen = true
    },
    openAddLinkModal() {
      this.addLinkModalOpen = true
    },
    openClearChatModal() {
      if (this.isActive) {
        this.clearChatModalOpen = true
      }
    },
    closeBagMoneyWaitModal() {
      this.bagMoneyWaitModalOpen = false
    },
    closeBagMoneyContentModal() {
      this.bagMoneyContentModalOpen = false
    },
    closeSupportModal() {
      this.supportModalOpen = false
    },
    onVolume() {
      this.volumeOff = false
      this.unMute()
      this.$forceUpdate()
    },
    closeRoomThemeMenu() {
      this.roomThemeMenuOpen = false
    },
    closeLeaveRoomModal() {
      this.leaveRoomModalOpen = false
    },
    closeStartStreamModal() {
      this.startStreamModalOpen = false
    },
    closeStopStreamModal() {
      this.stopStreamModalOpen = false
    },
    closeAddLinkModal() {
      // getLink
      this.addLinkModalOpen = false
    },
    closeClearChatModal() {
      this.clearChatModalOpen = false
    },
    addLinkToChat(linkData){
      const { nameLink, msgLink, colorLink } = JSON.parse(linkData)

      this.links = [
        ...this.links,
        {
          nameLink: nameLink,
          msgLink: msgLink,
          colorLink: colorLink,
        }
      ]

      this.socket.send(JSON.stringify({
        action: "addLink",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          name: nameLink,
          msg: msgLink,
          color: colorLink,
        }
      }))
    },
    sendLinkToChat(linkData, idx) {
      // console.log('idx: ', idx)
      // console.log('ref: ', this.$refs.linkItem[idx])
      // if (idx && this.$refs.linkItem.length > 0) {
      //   this.$refs.linkItem[idx].click()
      // }
      const { nameLink, msgLink, colorLink } = JSON.parse(linkData)
      // jonas
      
      this.socket.send(JSON.stringify({
        action: "sendLink",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          name: nameLink,
          msg: msgLink,
          color: colorLink,
        }
      }))
      // console.log(document.querySelector(".chating_links"))
      this.$forceUpdate()
    },
    editLink(linkData) {
      const {
        nameLink,
        msgLink,
        colorLink,
        oldNameLink,
        oldMsgLink,
        oldColorLink,
      } = JSON.parse(linkData)

      this.socket.send(JSON.stringify({
        action: "editLink",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId),
          name: nameLink,
          msg: msgLink,
          color: colorLink,
          oldName: oldNameLink,
          oldMsg: oldMsgLink,
          oldColor: oldColorLink,
        }
      }))

      const linkIdForEdit = this.links.findIndex((link) => link.nameLink === oldNameLink && link.msgLink === oldMsgLink && link.colorLink === oldColorLink)

      if (linkIdForEdit > -1) {
        this.links.splice(
          linkIdForEdit,
          1,
          {
            nameLink: nameLink,
            msgLink: msgLink,
            colorLink: colorLink,
          }
        )
        // console.log(this.links, linkIdForEdit, nameLink)
      }

      this.$forceUpdate()
    },
    deleteLink(linkData) {
      const { nameLink, msgLink, colorLink } = JSON.parse(linkData)

      this.socket.send(JSON.stringify({
        action: "deleteLink",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          name: nameLink,
          msg: msgLink,
          color: colorLink,
        }
      }))
      this.$forceUpdate()
    },
    deleteLinkFromWebinar(linkData) {
      const { nameLink, msgLink, colorLink } = JSON.parse(linkData)

      this.socket.send(JSON.stringify({
        action: "deleteLinkFromWebinar",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          name: nameLink,
          msg: msgLink,
          color: colorLink,
        }
      }))

      this.links = this.links.filter((link) => link.nameLink !== nameLink || link.msgLink !== msgLink || link.colorLink !== colorLink)

      this.$forceUpdate()
    },
    sendMsg() {
      if (
        (this.msg.length > 255
        || this.msg.length === 0
        || this.msg.trim() === ''
        || this.iBanned
        || this.isBlockChat
        || !this.isActive)
        && (!this.isAdmin 
        && !this.isModer)
      ) {
        return
      }

      if ((!this.isAdmin) && !this.allowChatLinks && this.msg.toLowerCase().trim().match(/.*(http|https).*/)) {
        this.notAllowLinksAlert = true
        setTimeout(() => {
          this.notAllowLinksAlert = false
        }, 3000)

        return
      }

      if (this.banWords.some((banWord) => this.msg.toLowerCase().trim().includes(banWord.toLowerCase().trim()))) {
        this.banWordAlert = true
        setTimeout(() => {
          this.banWordAlert = false
        }, 3000)

        return
      }
      // const banWords = this.webinar.banWords.split(",")

      this.socket.send(JSON.stringify({
        action: "send",
        data: {
          chat: String(this.webinarId), // secret   this.$route.params.id
          device: String(navigator.userAgent?.toLowerCase()),
          msg: this.msg,
          isAutowebinar: isAutowebinar,
          roomNumber: this.roomNumber,
          timestamp: moment().tz('Europe/Moscow'), // Date.now(), 
        }
      }))
      this.msg = ""
    },
    async start() {
      this.isBlockChatBeforeStart = false
      if (this.dateStartPole) {
        document.getElementById('mobilePole').style.display = "none"
      }
      this.startState = true
      this.socket.send(JSON.stringify({
        action: "updateAutowebinarRoomState",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          updateState: 1,
          timestamp: moment().tz('Europe/Moscow'), // Date.now(), 
          roomNumber: this.roomNumber
        }
      }))
      console.log("start")
      this.enableWebinar(this.webinarId, 1, this.isAutoWebinar)
      this.dateStartPole = ""
      
      if (this.screensaverAudio) {
        console.log("audioState=================>", this.audioPlayerStatus)
        // if (this.audioPlayerStatus) {
          document.getElementById("screensaverAudio").pause()
        // }
        document.getElementById("screensaverAudio").style.display = "none";
      } else if (this.screensaverVideo) {
        // this.screensaverVideoPlayer.stopVideo()

        this.$store.commit('updateVideoState', 0)
        // document.getElementById('screensaverVideo').innerHTML= ''
        rt.stop()
        rt = null
        console.log(rt)
        document.getElementById('screensaverVideo').style.display = "none";
        document.getElementById('screensaverVideo').innerHTML = "";
        document.getElementById('screen__overlay').style.display = "none";
      }
      // const urlContext = this.source.split("watch?v=")
      // const videoId = urlContext[urlContext.length - 1]
      // console.log(this.readyYT)
      // if(!this.readyYT){
        
      //   await new Promise((_r) => {
      //     const intval = setInterval(()=> {
      //       if(this.readyYT){
      //         _r()
      //         clearInterval(intval)
      //       }
      //     }, 1000)
      //   })
      // }
      
      let playTime = this.playTime ? this.playTime : moment().tz('Europe/Moscow')
      var startTime = 0
      console.log("playTimeeeeeeeeeeeeeeee", playTime)
      let date = new Date()
      let dbDate = new Date(playTime)
      let offset = date.getTimezoneOffset() 
      let now = date.getTime() + (offset * 60000)
      let playTimeTemp = dbDate.getTime() + (offset * 60000)

      let diffTime = 0
      console.log("utc========", date)
      console.log("dbUtc========", dbDate)
      if (playTimeTemp < now) {
        diffTime = Math.floor((now - playTimeTemp) / 1000)
      }

      console.log("diffffffffffffffffff", diffTime)

      if (!this.isAutoWebinar) {
        if (diffTime > 60) {
          startTime = diffTime
        } else {
          startTime = 0
        }
      }
      localStorage.setItem('diff', diffTime)
      document.getElementById("player__overlay").style.display = "none";
      document.getElementById("black").style.display = "none";
      

      if (this.videoType) {
        var that = this
        console.log(testPlayer, flvPlayer)
        testPlayer.ready(function () {
          console.log("FLV Player is ready");

          const savedTime = localStorage.getItem('playerUpdateTime');
          if (savedTime) {
            testPlayer.currentTime(savedTime); // Set the current time to the saved time
          }

          // testPlayer.play();
          flvPlayer.play()

          // Continuously update localStorage with current playback time
          testPlayer.on('timeupdate', function () {
            localStorage.setItem('playerUpdateTime', testPlayer.currentTime());
          });

          // When video ends, clear saved time
          testPlayer.on('ended', function () {
            localStorage.removeItem('playerUpdateTime');
            localStorage.removeItem('roomId');
            localStorage.removeItem('roomNumber');
            that.socket.send(JSON.stringify({
              action: "updateAutowebinarRoomState",
              data: {
                isAutowebinar: isAutowebinar,
                chat: String(that.webinarId),
                updateState: -1,
                timestamp: moment().tz('Europe/Moscow'),
              }
            }));
          });
        });
      } else {
        var that = this
        testPlayer.ready(function() {
          console.log("readyyyyyyyyyyyyyyyy")
          const savedTime = localStorage.getItem('playerUpdateTime');
          if (savedTime) {
            testPlayer.currentTime(savedTime); // Set the current time to the saved time
          }
          testPlayer.load()
          // Automatically play the video (optional, based on user interaction rules)
          testPlayer.play().catch(function(error) {
            console.error('Error playing the video:', error);
          });
          testPlayer.on('timeupdate', function() {
            localStorage.setItem('playerUpdateTime', testPlayer.currentTime());
          });
          testPlayer.on('ended', function() {
            localStorage.removeItem('playerUpdateTime');
            localStorage.removeItem('roomId');
            localStorage.removeItem('roomNumber');
            that.socket.send(JSON.stringify({
              action: "updateAutowebinarRoomState",
              data: {
                isAutowebinar: isAutowebinar,
                chat: String(that.webinarId), // this.$route.params.id,
                updateState: -1,
                timestamp: moment().tz('Europe/Moscow'), // Date.now(), 
              }
            }))
          });
        });
      }

      

      // Save the current time every time the video updates its playback position
      

      // Clear the stored time when the video ends
      
      // videoPlayer.play();
      // if (this.player) {
      //   this.player.loadVideoById({
      //     'videoId': videoId,
      //     'startSeconds': diffTime,
      //   })
      // }

      // this.player = new window.YT.Player('ytplayer', {
      //   height: '100%',
      //   width: '100%',
      //   cc_load_policy: 1,
      //   playerVars: {
      //     playsinline: 1,
      //     enablejsapi: 1,
      //     origin: window.location.href,
      //     autoplay: 1,
      //     mute: 0,
      //     controls: 0,
      //     cc_load_policy: 1,
      //     rel: 0,
      //     iv_load_policy: 3, 
      //     vq: 'hd1080',
      //   },
      //   videoId: videoId,
      //   events: {
      //     'onReady': onPlayerReady,
      //     'onStateChange': onPlayerStateChange,
      //     'ended': function() {
      //       console.log("end")
      //       document.getElementById('ytplayer').style.display = 'none';
      //     },
      //     'onError': onPlayerError
      //   }
      // });
      // if (typeof YT === 'undefined') {
      //   setTimeout(() => {
      //     this.videoPlayer = new YT.Player('ytplayer', {
      //       height: '100%',
      //       width: '100%',
      //       cc_load_policy: 1,
      //       playerVars: {
      //         start: startTime,
      //         playsinline: 1,
      //         enablejsapi: 1,
      //         origin: window.location.href,
      //         autoplay: 1,
      //         mute: 0,
      //         controls: 0,
      //         cc_load_policy: 1,
      //         rel: 0,
      //         iv_load_policy: 3, 
      //         vq: 'hd1080',
      //       },
      //       videoId: videoId,
      //       events: {
      //         'onReady': onPlayerReady,
      //         'onStateChange': onPlayerStateChange,
      //         'ended': function() {
      //           console.log("end")
      //           document.getElementById('ytplayer').style.display = 'none';
      //         },
      //         'onError': onPlayerError
      //       }
      //     });
      //   }, 3000);
      // } else if (typeof YT !== 'undefined') {
      //   this.videoPlayer = new YT.Player('ytplayer', {
      //     height: '100%',
      //     width: '100%',
      //     cc_load_policy: 1,
      //     playerVars: {
      //       start: startTime,
      //       playsinline: 1,
      //       enablejsapi: 1,
      //       origin: window.location.href,
      //       autoplay: 1,
      //       mute: 0,
      //       controls: 0,
      //       cc_load_policy: 1,
      //       rel: 0,
      //       iv_load_policy: 3, 
      //       vq: 'hd1080',
      //     },
      //     videoId: videoId,
      //     events: {
      //       'onReady': onPlayerReady,
      //       'onStateChange': onPlayerStateChange,
      //       'ended': function() {
      //         console.log("end")
      //         document.getElementById('ytplayer').style.display = 'none';
      //       },
      //       'onError': onPlayerError
      //     }
      //   });
      // }

      // function onPlayerReady(event) {
      //   console.log(event.target.getDuration())
      //   var isAutoWebinar = localStorage.getItem('isAutoWebinar')
      //   var startTime = 0
      //   var diffTime = localStorage.getItem('diff')
      //   if (!isAutoWebinar) {
      //     if (diffTime > 60) {
      //       if (startTime > event.target.getDuration()) {
      //         document.getElementById("player__overlay").style.display = "block";
      //         document.getElementById("player__overlay").style.zIndex = 9990;
      //         document.getElementById("pole").style.zIndex = 9991;
      //         document.getElementById("pole").text = "end"
      //         // this.dateStartPole = "Видео закончилось"
      //       } else {
      //         event.target.seekTo(startTime, true);
      //         event.target.playVideo();
      //       }
      //     } else {
      //       startTime = 0
      //       event.target.playVideo();
      //     }
      //   } else {
      //     event.target.playVideo();
      //   }
        
      //   setTimeout(() => {
      //     // document.getElementById("black").style.opacity = "0"
      //     // document.getElementById("black").remove()
      //     document.getElementById("volume").style.opacity = "0.7"
      //   }, 500)
      // }

      // function onPlayerStateChange(event) {
      //   console.log(event)
      //   var containerWidth = document.getElementById('player').clientWidth;
      //   var containerHeight = document.getElementById('player').clientHeight;

      //   // // Set the player's size to match the parent container
      //   event.target.setSize(containerWidth, containerHeight);
      //   console.log("player state===>", YT.PlayerState.PLAYING)
      //   if (event.data == YT.PlayerState.PLAYING) {
      //     setTimeout(() => {
      //       document.getElementById("player__overlay").style.display = "none";
      //     }, 2000)
      //     startKeepAwake();
      //   } else {
      //     stopKeepAwake();
      //   }
      //   if (event.data === 0) {
      //     document.getElementById("player__overlay").style.display = "block";
      //   }
      // }

      // function onPlayerError(event) {
      //   console.log("youtube error========>", event.data)
      //   if (event.data === 150) {
      //     document.getElementById("player__errorText").textContent = 'Встраивание данной трансляции запрещено по требованиям YouTube';
      //   }
      // }

      // Function to keep the screen awake
      let keepAwakeInterval;

      function startKeepAwake() {
        keepAwakeInterval = setInterval(() => {
          document.dispatchEvent(new MouseEvent('mousemove'));
        }, 10000); // Dispatch a mousemove event every 20 seconds
      }

      function stopKeepAwake() {
        clearInterval(keepAwakeInterval);
      }
      
    },
    async leave() {
      if (this.isAdmin || this.isModer) {
        this.stopState = true
      } else {
        if (!this.redirectOut) {
          this.stopState = true
        } else {
          window.location.href= this.redirectOut
        }
      }
    },
    mute() {
      if (this.videoPlayer) {
        try {
          this.videoPlayer.mute()
        } catch (e) {
          console.log(e)
        }
      }
    },
    unMute() {
      if (this.videoPlayer) {
        try {
          this.videoPlayer.unMute()
          document.getElementById("volume").style.opacity = "0"
          document.getElementById("volume").style.display = "none"
        } catch (e) {
          console.log(e)
        }
      }
    },
    timer() {
      const int = setInterval(()=> {
        const date = new Date()
        const dbDate = new Date(this.dateStart)
        const offset = date.getTimezoneOffset() 
        const utc = date.getTime() + (offset * 60000)
        const dbUtc = dbDate.getTime() + (offset* 60000)
        if (!this.isAutoWebinar) {

          const now = new Date(utc + 180 * 60000)
          const dateStart = new Date(dbUtc + 180 * 60000)
          console.log(dateStart)

          const diff = dateStart - now
          console.log("diff===========>", diff);
          if (diff < 0) {
            this.dateStartPole = "Вебинар закончился"
          }
          if (diff >= 0 && diff < 1000) {
            this.dateStartPole = "В эфире"
            clearInterval(int)
            return
          } 
          if (diff > 1000) {
            if (this.status == 1) {
              let dayDiff = 0
              let dayDiffText = ""
              let hDisplay = ""
              let hDiff = diff / 1000 / 3600
              if (hDiff > 24) {
                dayDiff = Math.floor(hDiff/24)
                if (dayDiff === 1) {
                  dayDiffText = dayDiff + " день "
                } else if (dayDiff > 1 && dayDiff < 5) {
                  dayDiffText = dayDiff + " дня "
                } else if (dayDiff > 4) {
                  dayDiffText = dayDiff + " дней "
                }
                // hDiff = Math.floor(hDiff%24)
                hDisplay = Math.floor(hDiff%24) < 10 ? ("0" + Math.floor(hDiff%24)) : Math.floor(hDiff%24)
              } else {
                hDisplay = Math.floor(hDiff) < 10 ? ("0" + Math.floor(hDiff)) : Math.floor(hDiff)
              }
              const minDiff = (diff - Math.floor(hDiff) * 1000 * 3600) / 1000 / 60
              const minDisplay = Math.floor(minDiff) < 10 ? ("0" + Math.floor(minDiff)) : Math.floor(minDiff)
              const secDiff = (diff - Math.floor(hDiff) * 1000 * 3600 - Math.floor(minDiff) * 60 * 1000) / 1000
              const secDisplay = Math.floor(secDiff) < 10 ? ("0" + Math.floor(secDiff)) : Math.floor(secDiff)
              this.dateStartPole = "Начало через " + dayDiffText + hDisplay + ":" + minDisplay + ":" + secDisplay
            }
          }
        }
      }, 1000)
    },
    removeMsg(text) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].msg == text) {
          this.items.slice(i, 1)
        }
      }
    },
    delMsg(msg){
      this.socket.send(JSON.stringify({
        action: "deleteMsg",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          msg: msg
        }
      }))
    },
    startStream(){
      if (!this.isAutoWebinar) {
        if (this.isAdmin || this.isModer) {
          this.updateWebinar()
        }
      }
      let roomData = {
        isAutowebinar: isAutowebinar,
        roomId: this.webinarId, 
        playTime: moment().tz('Europe/Moscow')
      }
      console.log(roomData)
      this.playTime = moment().tz('Europe/Moscow');
      this.$store.commit('setRoomData', roomData);
      this.socket.send(JSON.stringify({
        action: "startStream",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
          playTime: roomData.playTime,
        }
      }))
    },
    async stopStream() {
      if (!this.isAutoWebinar) {
        this.enableWebinar(this.webinarId, 0, this.isAutoWebinar)
        const curTime = moment().tz('Europe/Moscow')
        let duration = 0
        if (curTime.diff(this.playTime, 'milliseconds')) {
          duration = Math.abs(curTime.diff(this.playTime, 'milliseconds'))
        }
        const broadcastData = await this.$axios.get(`/broadcast/getBroadcastByCustomUrl?url=${this.url}`)
        console.log(broadcastData)
        if (broadcastData.data.length == 0) {
          await this.$axios.post(
            `/broadcast/createAutowebinar`,
            {
              webinarId: this.webinarId,
              videoType: 1,
              videoSource: this.autoWebinarSource,
              duration: duration,
              playTime: this.playTime,
            },
            {
              headers: {
                "Authorization": localStorage.getItem('token')
              }
            }
          ).then(data => {
            console.log('data: ', data)
            this.socket.send(JSON.stringify({
              action: "stopStream",
              data: {
                isAutowebinar: isAutowebinar,
                chat: String(this.webinarId), // this.$route.params.id,
              }
            }))
            return
          })
        } else {
          console.log(this.autoWebinarSource)
          await this.$axios.post(
            `/broadcast/updateAutowebinar`,
            {
              webinarId: this.webinarId,
              url: this.$route.params.id,
              videoType: 1,
              videoSource: this.autoWebinarSource,
              duration: duration,
              playTime: this.playTime,
            },
            {
              headers: {
                "Authorization": localStorage.getItem('token')
              }
            }
          ).then(data => {
            console.log('data: ', data)
            this.socket.send(JSON.stringify({
              action: "stopStream",
              data: {
                isAutowebinar: isAutowebinar,
                chat: String(this.webinarId), // this.$route.params.id,
              }
            }))
            return
          })
        }
      }
      // window.close()
    },
    blockChat(){
      if (this.isActive) {
        this.socket.send(JSON.stringify({
          action: "chatBlock",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId), // this.$route.params.id,
          }
        }))
      }
    },
    unBlockChat(){
      if (this.isActive) {
        this.socket.send(JSON.stringify({
          action: "chatUnBlock",
          data: {
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
      }
    },
    banUser(){
      if ((this.isAdmin || this.isModer) && this.highlightedMessages.length) {
        this.socket.send(JSON.stringify({
          action: "banUser",
          data: {
            messages: this.highlightedMessages,
            isAutowebinar: isAutowebinar,
            chat: String(this.webinarId),
          }
        }))
      }
      this.highlightedMessages = []
      this.$forceUpdate()
    },
    async goEditWebinar() {
      this.unBlockChat()

      this.$store.commit('setWebinarId', this.webinarId);
      this.$store.commit('setWebinarType', true);
      this.$store.commit('setRoomEdit', 1);
      // localStorage.setItem("editId", this.webinarId)
      // localStorage.setItem('isAutoWebinar', this.isAutowebinar)
      // localStorage.setItem('strScriptEditor', 1)

      const url = `${window.location.origin}/edit-autowebinar/2`;
      window.open(url, '_blank');

      // await this.$router.push(`/edit-webinar/1`)
      // this.$route.fullPath.replace(/\/w.*/, `/edit-webinar/${webinarId}`)
    },
    onHeart() {
      this.socket.send(JSON.stringify({
        action: "sendHeart",
        data: {
          isAutowebinar: isAutowebinar,
          chat: String(this.webinarId), // this.$route.params.id,
        }
      }))
      this.msg = ""
    },
    randomHeart() {
      if (this.hearts.length < 300) {
        const pW = this.$refs.notifiRef.offsetWidth
        this.hearts.push({
          x: Math.random() * 30, 
          y: 0, 
          w: Math.random() * pW
        })
      } else {
        this.hearts = []
      }
    },
    onBeforeUnload(event) {
      console.log(localStorage.getItem('tabState'))
      console.log(window.performance)
      console.log("unload====>", event)
      // event.preventDefault();
      localStorage.setItem('tabState', window)
      return false
    },
    toggleMenu() {
      var menu = document.getElementById("headerProfileIcons");
      if (menu.style.visibility === "hidden" || menu.style.visibility === "") {
        menu.style.visibility = "visible";
      } else {
        menu.style.visibility = "hidden";
      }
    },
    handleStorageChange(event) {
      if (event.key === 'sharedData') {
        const newData = JSON.parse(event.newValue);
        this.$store.commit('updateRoom', newData); // Updates Vuex store from the change made in another tab
      }
    }
  },
  beforeDestroy() {
    // Dispose of the player instance when the component is destroyed
    if (this.videoPlayer) {
      this.videoPlayer.dispose();
    }
  },
}
</script>

<style scoped>
#black {
  background-size: 100% 100%;
}

a {
  text-decoration: none;
}

#chating a {
  text-decoration: underline !important;
}

.bigFontSize {
  font-size: 18px !important;
}
.smallFontSize {
  font-size: 1rem !important;
}
.screenContent {
  display: flex;
  width: 100%;
}
.pinContent {
  display: flex;
  width: 100%;
  gap: 10px;
  padding: 5px 5px 0;
}
.comment {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 10px;
  padding: 0 5px;
  color: #FF0000;
}
.customLine {
  margin-top: 5px;
  border: 1px solid gray;
}
.contextMenu {
  position: absolute; 
  width: 100%; 
  height: 100%; 
  display: flex; 
  justify-content: center; 
  background: rgba(255, 255, 255, 0.5);
  z-index: 999;
}
.contextMenuContent {
  width: 70%;
  height: 100%;
  /* border: 1px solid gray; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
}
.menuBtn {
  width: 155px;
  min-width: 155px;
  font-size: 14px;
  background-color: #2A5885;
  padding: 0 10px;
  color: white;
}
.descriptionBlack {
  color: black !important;
  cursor: default !important;
}

#rightMessage {
  display: none;
  position: absolute;
  bottom: 30px;
  left: 30%;
  width: 45%;
  height: auto;
  background: #fff;
  border-radius: 7px;
  border: 1px solid #a39494;
  flex-direction: column;
  justify-content: flex-start;
  cursor: pointer;
  padding: 5px;
  z-index: 1000;
}

.messageUserAvatar {
  width: 47px;
  margin-right: 10px;
}

.messageDiv {
  width: 100%; 
  display: flex; 
  flex-direction: column; 
  justify-content: flex-start; 
}

.messageUser {
  font-family: 'Roboto';
  color: black;
  font-size: 18px;
  font-weight: 500;
}

.messageContent {
  margin-left: 10px;
  padding-left: 10px;
  font-family: 'Roboto';
  color: black;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  border-left: 2px solid #ff7700;
  display: flex;
  align-items: center;
  overflow-wrap: anywhere !important;
}

.authDescription {
  position: absolute;
  z-index: 999;
  padding: 10px;
  background-color: white;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.7);
  color: black;
  border-radius: 10px;
}

.guest-color-black {
  color: #000000;
}

.room-page {
  /* min-height: 100vh; */
  /* height: 100vh; */
  width: 100%;
  height: 100vh;
  /* height: 100%; */
  overflow: hidden;
  display: flex;
  justify-content: center;
  background-size: cover;
}
.room-content {
  /* min-height: 100vh; */
  /* height: 100vh; */
  /* overflow: hidden; */
  width: 100%;
  background-size: cover;
}

.room-parent {
  width: 100%;
  height: 90vh;
  padding: 5px 50px 0 30px;
}

.header-wrapper {
  position: relative;
  width: 100%; 
  height: 10vh;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.55);
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.5);
}
.btn-menu-toggle {
  display: none;
}
.room-wrapper {
  /* display: grid; 
  grid-template-columns: 2fr 1fr; 
  grid-column-gap: 20px;  */
  display: flex;
  gap: 20px;
  padding: 10px; 
  height: 100%;
  /* height: 65vh; */
}

.room {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 67%;
  height: fit-content;
  position: relative;
}

#player {
  width: 100%; 
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.black-box {
  width: 100%; 
  height: 100%;
  position: absolute;
  /* top: -66vh; */
  left: 0px;
  top: 0px; 
  /* background: gray;  */
  background-color: white;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  opacity: 1; 
  
}

.black-content {
  width: 100%;
  height: 100%;
  display: flex; 
  justify-content: center;
  align-items: center;
}

.video-volume {
  position: absolute;
  display: none;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  opacity: 0; 
  background-color: white;
  width: 200px;
  height: 200px;
  border-radius: 200px;  
  z-index: 9999;
}

.logo-img {
  width: 50px;
  height: 55px;
}

.v-footer {
  display: none;
}

.notification-container {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 200px;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}

.anim-heart-wrapper {
  position: absolute;
  height: 100%;
  animation: verticalIn 5s linear 0s alternate 1;
  background-color: transparent;
}

span.anim-heart {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: transparent;
  animation: animHeart 5s linear 0s alternate 1, 
              horizontalIn 0.8s linear 0s infinite alternate;
}

span.anim-heart::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    background: url(../static/heart.png);
    background-size: cover;
}

@keyframes animHeart {
    1%, 40% {
        opacity: 1;
    }
    0%, 85% {
        opacity: 0;
    }
}

@keyframes horizontalIn {
  from {
    transform: translateX(20%);
  }
  to {
    transform: translateX(80%);
  }
}

@keyframes verticalIn {
  0% {
    transform: translateY(100%);
  }
  50% {
    transform: translateY(70%);
  }
  100% {
    transform: translateY(-50%);
  }
}

.chat-heart {
  width: 20px;
  height: 20px;
  right: 80px;
  z-index: 1;
  bottom: 14px;
  border: none;
  outline: none;
  box-shadow: none;
  background: transparent;
  padding: 0;
  background: url(../static/heart.png);
  background-size: cover;
}
* {
  margin: 0;
  padding: 0;
}

p {
  margin-bottom: 0;
}

.form__author {
  display: flex;
  flex-direction: row;
  justify-content: left;
  padding: 5px 3px;
}

.form__author__custom {
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 1px;
}

.header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 30px;
}

.header__logo {
  display: flex;
  justify-content: flex-start;
  height: 100%;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  /* height: 80%; */
}

.header__menu {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.header__cataloge {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-left: 350px;
}

.buttons {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-right: 20px;
}

.button__wrapper {
  cursor: pointer;
}

.cataloge__title {
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 25px;
}

.header__cataloge__button {
  display: flex;
  align-items: center;
}

.header-profile-icons {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
}

.startPole {
  position: absolute;
  display: flex;
  align-items: center;
  height: 35px;
  padding: 0 10px;
  background: rgb(255, 255, 255);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 1);
  border-radius: 10px;
}

.logo__name {
  font-size: 25px;
  color: black;
  font-weight: 600;
  text-align: center;
  align-self: center;
  margin-left: 10px;
  margin-bottom: 0;
  z-index: 999;
}

.menu__title {
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  color: #000000;
  margin-bottom: 0;
  margin-left: 20px;
  /* overflow-wrap: break-word; */
  min-width: 300px;
  max-width: 1200px;
  text-align: center;
  height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1400px) {
  .menu__title {
    max-width: 800px;
  }
}

@media (max-width: 1200px) {
  .menu__title {
    max-width: 600px;
  }
}

@media (max-width: 500px) {
  .menu__title {
    min-width: 100px;
    max-width: 250px;
  }
}

.profile__icon {
  margin-right: 20px;
  cursor: pointer;
}

.room_action_notification__container {
  position: absolute;
  bottom: 30px;
  left: 30%;
  width: 40%;
  background: #fff;
  border-radius: 7px;
  border: 1px solid #a39494;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  gap: 20px;
  padding: 5px;
}

.action_notification__icon {
  width: 47px;
  height: 55px;
  margin-left: 20px;
  margin-right: 10px;
}

.action_notification__name {
  color: black;
  font-size: 18px;
}

.link_action_notification__msg_container {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.link_action_notification__msg {
  border-radius: 3px;
  color: #fff;
  padding: 2px 5px;
  line-height: 14px;
}

.link_action_notification__msg > a {
  color: #fff !important;
  font-size: 15px;
}

@media (max-width: 1500px) {
  .header__cataloge {
    margin-left: 250px;
  }
  .room-content {
    width: 100%;
  }
}

span {
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 27px;
  color: #0077FF;
}

.add {
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: #ABA385;
}

.adds {
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  position: relative;
}

.main__webinar {
  width: 100%;
  min-height: 100%;
}

.main__webinar__translate {
  width: 100%;
  height: 100%;
  margin-right: 40px;
}

.main__webinar__video {
  width: 100%;
  height: 100%;
  margin-top: 40px;
}

.main__webinar__buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0px;
}

.main__webinar > img {
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
}

.main {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  width: 95%;
  margin: 0 auto;
}

.main__webinar__video {
  display: flex;
  flex-direction: row;
}

.main__webinar__chat {
  width: 50%;
}

.main__webinar__videos {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.main__webinar__videos > img {
  width: 90%;
  height: 100%;
}

.webinar__chat__guest {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 15px;
}

.guest {
  margin-bottom: 0;
  margin-left: 11px;
}

.webinar__chat__title {
  margin-left: 10px;
}

.main__webinar__buttons > button, .main__webinar__buttons > a {
  width: 32.5%;
}

.buttons__translate {
  background: #04AF00;
  height: 52px;
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: #FFFFFF;
}

.webinar__chat__guest {
  color: black;
}

.webinar__chat__guest__dark {
  color: white;
}

.webinar__chat__chat {
  padding: 15px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 75vh;
  /* flex-grow: 1; */
  position: relative;
}

/* .webinar__chat__chat ::-webkit-scrollbar {
  width: 0 !important;height: 0;
} */

.webinar__chat__user {
  display: flex;
  border-radius: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
  color: wheat;
}

.buttons__setting {
  background: #0085FF;
  width: 100%;
  height: 52px;
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: #FFFFFF;
}

.webinar__chat__title {
  display: flex;
}

.buttons__addchat {
  background: #FF0000;
  height: 52px;
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: #FFFFFF;
}

.subtitle {
  margin-left: 10px;
}

.subtitle > button {
  width: 209px;
  height: 39px;
  background: #FF5C00;
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #FFFFFF;
  margin-top: 35px;
}

.profile__icon.volume {
  display: none;
}

.btn-addchat-small {
  display: none;
}

.player-wrapper {
  height: 70vh; 
  position: relative;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.5);
}

.container {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 100%;
}

@media screen and (max-width: 1450px) {
  .main__webinar__videos > img {
    width: 100%;
  }

  /* .webinar__chat__chat {
    height: 60vh;
  } */
}


@media screen and (max-width: 1100px) {
  .room_action_notification__container {
    width: 50%;
  }
  .header-wrapper {
    height: 10%;
  }
  .moder_panel {
    flex-wrap: wrap;
  }
  .logo__name {
    font-size: 20px;
    color: black;
    font-weight: 500;
    text-align: center;
    align-self: center;
    margin-left: 10px;
    margin-bottom: 0;
    z-index: 999;
  }

  .menu__title {
    text-align: left;
  }

  .container {
    max-width: 100%;
    width: 100%;
  }

  .webinar__chat__chat {
    height: 65vh;
  }
}

@media screen and (max-width: 769px) {
  .room-wrapper {
    gap: 0;
  }
  #screensaverAudioDiv {
    display: none;
  }
  .main__webinar__buttons {
    display: none;
  }

  .moder_panel {
    display: none !important;
  }

  .moder_panel_bottom {
    display: none !important;
  }

  #chatLinks {
    display: none !important;
  }

  .webinar__chat__user {
    display: none;
  }

  .room-content {
    height: 100vh;
  }

  .container {
    padding-right: 0px;
    padding-left: 0px;
  }
  .notification-container {
    height: 300px;
  }

  .header-wrapper {
    height: 90px;
  }

  .menu-hamburger {
    position: absolute;
    top: 30px;
    right: 11px;
    display: block;
    width: 40px;
    height: 40px;
    background-image: url('../static/charm_menu-hamburger.png');
    background-size: contain;
    cursor: pointer;
  }

  .header-profile-icons {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    position: absolute;
    background-color: #8f8f8f;
    border-radius: 5px;
    right: 0px;
    top: 80px;
    padding-left: 7px;
    padding-right: 10px;
    visibility: hidden;        
    z-index: 9999;
  }

  .profile__icon {
    margin-right: 0px;
  }

  .volume-hidden {
    display: none;
  }

  .room_action_notification__container {
    position: fixed;
    width: 80%;
    left: 10%;
    bottom: 10px;
  }

  .profile__icon.volume {
    display: block;
  }

  .volume {
    margin-right: 0px;
    position: absolute;
    top: 34px;
    right: 70px;
    width: 35px;
    height: 35px;
  }

  .profile__icon.volume img {
    width: 35px;
    height: 35px;
  }

  .dropdown-content {
    right: 58px !important;
  }

  .main__webinar__buttons > button, .main__webinar__buttons > a {
    width: 49%;
  }


  .video-bottom {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }

  .btn-addchat-small {
    display: block;
    padding-left: 20px;
    padding-right: 20px;
  }

  .room-parent {
    padding: 0 5px;
  }

  .room-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 10px; 
    padding-right: 10px; 
    /* height: 479px; */
  }

  .room {
    /* height: 400px;  */
    width: 100%;
  }

  .chat {
    width: 100% !important;
  }

  .room-parent {
    height: auto;
    /* padding: 15px 0; */
  }

  .player-wrapper {
    height: 300px;
  }

  .player {
    height: 300px;
  }

  .black-box {
    height: 300px;
    /* top: -411px; */
  }

  #playerWindow {
    height: 300px;
  }

  .webinar__chat__chat {
    height: 360px;
    max-height: 400px;
  }
  #rightMessage {
    position: fixed;
    left: 10%;
    bottom: 10px;
  }
}

#chating {
  overflow-x: hidden;
}

#mobilePole {
  display: none;
}

@media screen and (max-width: 600px) {
  .room-wrapper {
    padding-left: 10px;
    padding-right: 10px;
  }

  .video-volume {
    width: 100px;
    height: 100px;
  }

  .startPole {
    display: none
  }
  #mobilePole {
    display: flex;
    position: relative;
    align-items: center;
    height: 35px;
    padding: 0 10px;
    background: rgb(255, 255, 255);
    /* box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 1); */
    border: 1px solid gray;
    border-radius: 10px;
  }
  .logo__name {
    font-size: 14px;
  }
}

@media screen and (max-width: 500px) {
  
  .action_notification__name {
    font-size: 14px;
  }
  .dropdown-content {
    top: 58px !important;
    right: 42px !important;
  }
  .header-profile-icons {
    top: 42px;
  }
  .header-profile-icons > .profile__icon > img, .header-profile-icons > .profile__icon > button > img {
    width: 25px;
  }
  .header-wrapper {
    height: 46px;
  }
  .header__logo {
    margin-top: 12px;
  }
  .logo-img {
    width: 22px;
    height: 25px;
  }
  .menu__title {
    font-size: 16px;
    line-height: 17px;
    margin-top: 3px;
  }
  .profile__icon.volume img {
    width: 19px;
    height: 19px;
  }    
  .volume {
    top: 11px;
    right: 30px;
  }
  .menu-hamburger {
    top: 13px;
  }
  .menu-hamburger {
    width: 22px;
    height: 22px;
  }

  .player-wrapper {
    height: 200px;
  }
  .player {
    height: 200px;
  }
  .black-box {
    height: 200px;
  }
  .notification-container {
    height: 200px;
  }

  #playerWindow {
    height: 200px;
  }

  .moder_delete p, .moder_ban_delete p, .moder_ban p, .moder_ignor p {
    display: none;
  }

  .buttons__translate, .buttons__addchat, .buttons__setting {
    font-size: 14px;
    line-height: 16px;
    height: 35px;
  }
}

@media screen and (max-width: 400px) {
  .room-wrapper {
    padding-left: 10px;
    padding-right: 10px;
  }
}

.dropdown {
  max-width: 13em;
  position: relative;
  display: flex;
  align-items: center;
}
.webinar__none__date {
  margin-left: 750px;
}

.dropdown-btn {
  font-size: 18px;
  border: none;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em 0.5em;
  border-radius: 0.5em;
  cursor: pointer;
}
.search {
  border-radius: 10px;
  background: #FE6637;
  color: #FFF;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 35px;
}
input {
  /* border-radius: 5px; */
  /* border: 1px solid #818C99; */
  width: 100%;
  height: 39px;
  outline: none;
  padding-left: 10px;
}


.dropdown-content {
  position: absolute;
  top: 95px;
  right: 150px;
  visibility: hidden;
  overflow: hidden;
  width: 340px;
  height: 319px;
  z-index: 1500;
}

.dropdown-content li {
  border-radius: 0 0 10px 10px;
  background: #E6E6E6;
  box-shadow: 0 0 25px 3px rgba(0, 0, 0, 0.15);
  position: relative;
  justify-content: center;
  align-items: center;
  left: 100%;
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  transition-delay: calc(60ms * var(--delay));
}

.dropdown-backgrounds-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dropdown-background {
  width: 90px;
  height: 55px;
  margin-right: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.dropdown-background:hover {
  border: 3px solid #FF5C00;
}

.dropdown-background img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.dropdown-content span {
  font-family: 'Inter', Arial, sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  color: black;
}

.day-night-mode-icon {
  margin-right: 10px;
}

.video-controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  width: 200px;
  height: 30px;
  margin-top: 30px;
  padding: 10px;
  background: whitesmoke;
  border-radius: 10px;
}

.is-firefox * { 
  scrollbar-width: thin;
  scrollbar-color: rgba(226, 226, 226, 0.35) rgba(46, 27, 11, 1); 
}

.is-safari * { 
  scrollbar-width: thin;
  scrollbar-color: rgba(226, 226, 226, 0.35) rgba(46, 27, 11, 1); 
}

/* Style the scrollbar track (background) */
::-webkit-scrollbar {
  width: 5px;
  background: #000;
}

/* Style the scrollbar handle */
::-webkit-scrollbar-thumb {
  background: #fff;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

.chating_links {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0px 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 0;
}

.chating_link {
  height: 39px;
  width: 365px;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.moder_panel {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0px 5px 0px;
}

.moder_panel_bottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0px 0px 0px;
}

.moder_btn {
  height: 30px;
  max-width: 108px;
  padding: 5px 5px 5px 5px;
  border-radius: 2px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  line-height: 12px;
  font-size: 11px;
  margin-left: 5px;
  cursor: pointer;
  flex-grow: 1;
}

.moder_highlight {
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid #261810;
  color: black !important;
}

.moder_delete {
  background-color: #FF5C00;
}

.moder_ban_delete {
  background-color: #FF431A;
}

.moder_ban {
  background-color: #FF0000;
}

.moder_ignor {
  background-color: #2A5885;
}

.moder_bottom {
  background-color: rgba(0, 0, 0, 0);
}

.chat {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 33%;
  height: 100%;
  gap: 10px;
}

.chat_admin_color {
  color: #ff0000;
}

.text__black {
  color: black;
}

.text__white {
  color: white;
}

#ytplayer {
  position: relative;
}

#player__overlay {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

#player__header {
  width: 100%;
  height: 52%;
  background-image: linear-gradient(to bottom, white, transparent);
}

#player__errorText {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  font-size: 22px;
  color: black;
  z-index: 999;
}

#player__footer {
  width: 100%;
  height: 48%;
  background-image: linear-gradient(to top, white, transparent);
}

#screen__overlay {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: lightgray;
}

#screen__header {
  width: 100%;
  height: 52%;
  background-image: linear-gradient(to bottom, white, transparent);
}

#screen__errorText {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: end;
  font-size: 22px;
  color: black;
  z-index: 999;
}

#screen__footer {
  width: 100%;
  height: 48%;
  background-image: linear-gradient(to top, white, transparent);
}

#screensaverVideo {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#screenaverVideo iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

#video-player {
  width: 100%;
  height: 100%;
}

#temp-video-player {
  display: none;
}

.video-js video {
  object-fit: contain;
}

</style>
