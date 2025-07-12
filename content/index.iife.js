var G=Object.defineProperty;var J=(E,A,D)=>A in E?G(E,A,{enumerable:!0,configurable:!0,writable:!0,value:D}):E[A]=D;var x=(E,A,D)=>J(E,typeof A!="symbol"?A+"":A,D);(function(){"use strict";var E=(g=>(g.SYSTEM="system",g.USER="user",g.PLANNER="planner",g.NAVIGATOR="navigator",g.VALIDATOR="validator",g))(E||{});class A{constructor(){x(this,"isVisible",!1);x(this,"overlay",null);x(this,"messages",[]);x(this,"currentSessionId",null);x(this,"port",null);x(this,"showPlusPopup",!1);x(this,"tabs",[]);x(this,"images",[]);x(this,"selectedTabsContext",[]);x(this,"plusPopupElement",null);x(this,"fileInputElement",null);x(this,"updateContextDisplayFn",null);x(this,"isRecording",!1);x(this,"isProcessingSpeech",!1);x(this,"speechRecognition",null);x(this,"speechRecognitionTimeout",null);x(this,"voiceActivityTimeout",null);x(this,"audioContext",null);x(this,"analyser",null);x(this,"microphoneStream",null);x(this,"silenceDetection",!1);x(this,"voiceButton",null);x(this,"voiceImg",null);x(this,"sendButton",null);x(this,"textarea",null);x(this,"updateButtonsRef",null);this.init()}async init(){chrome.runtime.onMessage.addListener((e,t,n)=>{e.action==="ping"?n({success:!0}):e.action==="toggleSmallChat"?this.isVisible?this.hide():this.show(()=>{e.sessionId&&this.loadSession(e.sessionId)}):e.action==="showSmallChat"?this.show(()=>{e.sessionId&&this.loadSession(e.sessionId)}):e.action==="hideSmallChat"&&this.hide()}),this.setupConnection()}setupConnection(){try{if(!this.isExtensionContextValid()){console.log("Extension context invalidated, cannot setup connection"),this.handleExtensionReload();return}this.port=chrome.runtime.connect({name:"small-chat-content-connection"}),this.port.onMessage.addListener(e=>{e.type==="simple_chat_response"&&this.handleChatResponse(e)}),this.port.onDisconnect.addListener(()=>{if(console.log("Small chat content port disconnected"),this.port=null,!this.isExtensionContextValid()){console.log("Extension context invalidated, stopping reconnection attempts"),this.handleExtensionReload();return}setTimeout(()=>this.setupConnection(),2e3)}),setInterval(()=>{if(this.port)try{if(!this.isExtensionContextValid()){console.log("Extension context invalidated during heartbeat, cleaning up"),this.handleExtensionReload();return}this.port.postMessage({type:"heartbeat"})}catch(e){if(console.warn("Failed to send heartbeat:",e),e instanceof Error&&e.message&&(e.message.includes("Extension context invalidated")||e.message.includes("back/forward cache")||e.message.includes("message channel is closed"))){console.log("Extension/page context issue detected during heartbeat"),this.handleExtensionReload();return}}},3e4)}catch(e){if(console.error("Failed to setup small chat connection:",e),e instanceof Error&&e.message&&e.message.includes("Extension context invalidated")){console.log("Extension context invalidated during connection setup"),this.handleExtensionReload();return}setTimeout(()=>this.setupConnection(),5e3)}}async loadSession(e){if(!this.isExtensionContextValid()){console.log("Extension context invalidated, cannot load session"),this.handleExtensionReload();return}this.currentSessionId=e;try{const t=await chrome.runtime.sendMessage({action:"getSession",sessionId:e});t.success&&t.session&&(this.messages=t.session.messages.map(n=>{const a={...n,isUser:n.actor===E.USER,context:n.context};return console.log("💡 Loaded message:",{isUser:a.isUser,hasContext:!!n.context,context:n.context,content:n.content?n.content.substring(0,50):"No content"}),a}),this.updateMessagesDisplay())}catch(t){console.error("Failed to load session:",t)}}show(e){if(this.isVisible){e&&e();return}this.isVisible=!0,this.showLoadingMessage(),setTimeout(()=>{this.createOverlay(),e&&e()},300)}showLoadingMessage(){const e=document.createElement("div");e.id="wonder-chat-loading",e.style.cssText=`
      all: initial;
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 14px;
      z-index: 999998;
      animation: wonderFadeIn 0.3s ease-out;
      box-sizing: border-box;
      margin: 0;
      border: none;
      outline: none;
      line-height: 1.4;
      text-align: left;
      text-decoration: none;
      text-transform: none;
      letter-spacing: normal;
      word-spacing: normal;
      text-shadow: none;
      vertical-align: baseline;
      white-space: normal;
      word-wrap: normal;
      direction: ltr;
      unicode-bidi: normal;
    `;const t=document.createElement("style");t.textContent=`
      @keyframes wonderFadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,document.head.appendChild(t),e.textContent="Loading Wonder Chat...",document.body.appendChild(e),setTimeout(()=>{const n=document.getElementById("wonder-chat-loading");n&&n.remove(),t.parentNode&&t.remove()},500)}hide(){this.isVisible&&(this.isVisible=!1,this.overlay&&(this.overlay.remove(),this.overlay=null))}createOverlay(){this.overlay&&this.overlay.remove(),this.overlay=document.createElement("div"),this.overlay.id="wonder-small-chat-overlay",this.overlay.className="small-chat-overlay",this.overlay.style.cssText=`
      all: initial;
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      pointer-events: auto;
      user-select: text;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border: none;
      outline: none;
      color: #000000;
      font-size: 14px;
      line-height: 1.4;
      text-align: left;
      text-decoration: none;
      text-transform: none;
      letter-spacing: normal;
      word-spacing: normal;
      text-shadow: none;
      vertical-align: baseline;
      white-space: normal;
      word-wrap: normal;
      direction: ltr;
      unicode-bidi: normal;
    `;const e=document.createElement("div");e.className="small-chat-container",e.style.cssText=`
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 175, 255, 0.4) 100%);
    `;const t=document.createElement("div");t.id="wonder-small-chat-messages",t.style.cssText=`
      flex: 1;
      overflow-y: auto;
      padding: 16px 12px 12px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      scrollbar-width: thin;
      scrollbar-color: #ECECEC transparent;
    `;const n=document.createElement("style");n.textContent=`
      /* CSS Reset for small chat overlay to prevent Google page interference */
      #wonder-small-chat-overlay *,
      #wonder-small-chat-overlay *::before,
      #wonder-small-chat-overlay *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        text-align: inherit;
        text-decoration: none;
        text-transform: none;
        letter-spacing: normal;
        word-spacing: normal;
        text-shadow: none;
        vertical-align: baseline;
        white-space: normal;
        word-wrap: normal;
        direction: ltr;
        unicode-bidi: normal;
      }
      
      #wonder-small-chat-messages::-webkit-scrollbar {
        width: 4px;
      }
      #wonder-small-chat-messages::-webkit-scrollbar-track {
        background: transparent;
      }
      #wonder-small-chat-messages::-webkit-scrollbar-thumb {
        background: #ECECEC;
        border-radius: 4px;
      }
      
      /* Plus popup animations */
      @keyframes popupFadeIn {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(-4px);
        }
      }
      
      /* Hide scrollbar in plus popup */
      .plus-popup::-webkit-scrollbar {
        display: none;
      }
      
      /* Context item animations */
      @keyframes contextItemFadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      /* Hide scrollbar in context display */
      .small-chat-context-display::-webkit-scrollbar {
        display: none;
      }
    `,document.head.appendChild(n);const a=document.createElement("div");a.className="small-chat-input",a.style.cssText=`
      padding: 12px 0;
      background: transparent;
      position: relative;
      z-index: 1;
    `;const s=document.createElement("div");s.className="small-chat-textarea-container",s.style.cssText=`
      display: flex;
      align-items: flex-end;
      padding: 0 12px;
      gap: 4px;
      width: 100%;
      max-width: 100%;
      min-width: 0;
    `;const o=document.createElement("div");o.style.cssText=`
      flex: 1;
      min-width: 0;
      max-width: 100%;
    `;const d=document.createElement("div");d.style.cssText=`
      position: relative;
      flex-shrink: 0;
    `;const i=document.createElement("button");i.className="small-chat-plus-circle",i.type="button",i.setAttribute("aria-label","Add content"),i.style.cssText=`
      width: 48px;
      height: 48px;
      min-width: 48px;
      background: #FFFFFF;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: background-color 0.2s ease;
      flex-shrink: 0;
      margin-bottom: 0px;
    `;const p=document.createElement("img");p.alt="Add content",p.className="h-5 w-5",p.style.cssText="width: 20px; height: 20px;";try{p.src=chrome.runtime.getURL("side-panel/icons/plus.svg")}catch{p.src=`data:image/svg+xml;base64,${btoa(`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="#858585" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`)}`}i.appendChild(p),i.addEventListener("mouseenter",()=>{i.style.backgroundColor="#F9F9F9"}),i.addEventListener("mouseleave",()=>{i.style.backgroundColor="#FFFFFF"}),i.addEventListener("click",async r=>{r.stopPropagation(),this.showPlusPopup?this.hidePlusPopup():(await this.fetchTabs(),this.showPlusPopup=!0,this.createPlusPopup())});const c=document.createElement("div");c.className="small-chat-input-wrapper",c.style.cssText=`
      background: #FFFFFF;
      border-radius: 24px;
      transition: all 0.2s ease;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow: visible;
      padding: 0;
    `;const u=document.createElement("div");u.className="small-chat-context-display",u.style.cssText=`
      display: none;
      margin-bottom: 8px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      flex-wrap: nowrap;
      gap: 4px;
      padding: 8px 8px 0 8px;
    `;const h=document.createElement("div");h.className="small-chat-input-container",h.style.cssText=`
      position: relative;
      background: #FFFFFF;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 100%;
      min-width: 0;
    `;let l=1;const m=()=>this.images.length>0||this.selectedTabsContext.length>0,T=r=>{if(!r.value)return 1;const y=r.style.height;r.style.height="auto";const C=20,f=r.scrollHeight-24,w=Math.max(1,Math.ceil(f/C));return r.style.height=y,Math.min(w,4)},S=()=>{const F=l*20+24;let f=Math.max(48,F);const w=104;return F>w&&(f=48+(w-44)),{containerHeight:`${f}px`,textareaHeight:`${F}px`,borderRadius:m()||l>1?"8px":"24px"}},B=()=>{const r=S();m()?(u.style.display="flex",c.style.padding="8px",c.style.borderRadius="8px",h.style.borderRadius="4px",h.style.height=r.containerHeight,b.style.padding="12px 48px 12px 12px",L.style.padding="12px 48px 12px 12px"):(u.style.display="none",c.style.padding="0",c.style.borderRadius=r.borderRadius,h.style.borderRadius=r.borderRadius,h.style.height=r.containerHeight,b.style.padding="12px 48px 12px 16px",L.style.padding="12px 48px 12px 16px"),u.innerHTML="";const y=[...this.images.map((F,f)=>({type:"image",data:F,index:f})),...this.selectedTabsContext.map((F,f)=>({type:"tab",data:F,index:f}))];if(y.length===0)return;const C=y,$=document.createElement("div");$.style.cssText=`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        width: 100%;
      `,C.forEach(F=>{const f=document.createElement("div");if(f.className="context-item",f.style.cssText=`
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          color: #000000;
          cursor: pointer;
          transition: background-color 0.2s ease;
          animation: contextItemFadeIn 0.2s ease-out;
          min-width: 0;
        `,F.type==="image"){const w=F.data;f.innerHTML=`
            <img class="context-icon" src="${w.data}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0;" />
            <span class="context-x" style="display: none; margin-right: 8px; color: #858585; flex-shrink: 0; font-size: 14px; line-height: 1;">×</span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${w.name}</span>
          `,f.addEventListener("click",()=>{this.images.splice(F.index,1),B()})}else{const w=F.data;f.innerHTML=`
            <img class="context-icon" src="${w.tab.favIconUrl}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0;" />
            <span class="context-x" style="display: none; margin-right: 8px; color: #858585; flex-shrink: 0; font-size: 14px; line-height: 1;">×</span>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;" title="${w.summary}">${w.tab.title}</span>
          `,f.addEventListener("click",()=>{this.selectedTabsContext=this.selectedTabsContext.filter(P=>P.tab.id!==w.tab.id),B()})}f.addEventListener("mouseenter",()=>{f.style.backgroundColor="#e5e5e5";const w=f.querySelector(".context-icon"),P=f.querySelector(".context-x");w&&(w.style.display="none"),P&&(P.style.display="block")}),f.addEventListener("mouseleave",()=>{f.style.backgroundColor="#f5f5f5";const w=f.querySelector(".context-icon"),P=f.querySelector(".context-x");w&&(w.style.display="block"),P&&(P.style.display="none")}),$.appendChild(f)}),u.appendChild($)};this.updateContextDisplayFn=B;const V=()=>{const r=S();h.style.height=r.containerHeight,b.style.height=r.textareaHeight,b.style.maxHeight=l>=4?"104px":r.textareaHeight,b.style.overflowY=l>=4?"auto":"hidden",m()||(c.style.borderRadius=r.borderRadius,h.style.borderRadius=r.borderRadius),B()},b=document.createElement("textarea");b.className="small-chat-textarea",b.placeholder="Ask Wonder",b.rows=1,b.style.cssText=`
      flex: 1;
      resize: none;
      border: none;
      background: transparent;
      color: #2C2C2C;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 20px;
      padding: 12px 48px 12px 16px;
      width: 100%;
      outline: none;
      transition: all 0.2s ease;
      scrollbar-width: none;
      -ms-overflow-style: none;
      min-width: 0;
    `,this.textarea=b;const L=document.createElement("div");L.className="small-chat-agent-overlay",L.style.cssText=`
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      font-family: inherit;
      line-height: 20px;
      z-index: 1;
      padding: 12px 48px 12px 16px;
      white-space: pre-wrap;
      word-break: break-words;
      width: 100%;
      display: none;
    `;const Y=document.createElement("style");Y.textContent=`
      #wonder-small-chat-overlay .small-chat-textarea::-webkit-scrollbar {
        display: none;
      }
      #wonder-small-chat-overlay .small-chat-textarea::placeholder {
        color: #858585;
        opacity: 1;
      }
    `,document.head.appendChild(Y);const v=()=>{const r=b.value;if(r.toLowerCase().indexOf("@agent")===0){b.style.color="transparent",L.style.display="flex";const C=document.createElement("span");C.style.fontWeight="bold",C.style.color="#FFAFFF",C.textContent="@agent";const $=document.createElement("span");$.style.color="#2C2C2C",$.textContent=r.slice(6),L.innerHTML="",L.appendChild(C),L.appendChild($)}else b.style.color="#2C2C2C",L.style.display="none"},X=()=>{const r=T(b);r!==l&&(l=r,V()),v()};V();const M=document.createElement("button");M.className="small-chat-voice-circle",M.type="button",M.setAttribute("aria-label","Voice input"),M.style.cssText=`
      width: 32px;
      height: 32px;
      min-width: 32px;
      background: transparent;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 8px;
      bottom: 8px;
      cursor: pointer;
      z-index: 1;
      transition: background-color 0.2s ease;
    `;const H=document.createElement("img");H.alt="Voice input",H.className="w-6 h-6",H.style.cssText=`
      width: 24px;
      height: 24px;
      filter: brightness(0) saturate(100%) invert(52%) sepia(0%) saturate(0%) hue-rotate(173deg) brightness(95%) contrast(85%);
      transition: filter 0.2s ease;
    `;try{H.src=chrome.runtime.getURL("side-panel/icons/voice.svg")}catch{const y=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8V16M7.5 9.5V15M12 5V19.5M16.5 3V21M21 10V14" stroke="#858585" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;H.src=`data:image/svg+xml;base64,${btoa(y)}`}M.appendChild(H),this.voiceButton=M,this.voiceImg=H,M.addEventListener("mouseenter",()=>{this.isRecording||(H.style.filter="brightness(0) saturate(100%) invert(17%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(95%)")}),M.addEventListener("mouseleave",()=>{this.isRecording||(H.style.filter="brightness(0) saturate(100%) invert(52%) sepia(0%) saturate(0%) hue-rotate(173deg) brightness(95%) contrast(85%)")});const k=document.createElement("button");k.className="small-chat-send-circle",k.type="submit",k.style.cssText=`
      width: 32px;
      height: 32px;
      min-width: 32px;
      background: #FFAFFF;
      border: none;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 8px;
      bottom: 8px;
      cursor: pointer;
      z-index: 1;
      transition: background-color 0.2s ease;
    `;const U=document.createElement("img");U.alt="Send message",U.className="w-6 h-6",U.style.cssText=`
      width: 24px;
      height: 24px;
      transform: rotate(-90deg);
    `;try{U.src=chrome.runtime.getURL("side-panel/icons/send.svg")}catch{const y=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H18.5M18.5 12L12.5 6M18.5 12L12.5 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;U.src=`data:image/svg+xml;base64,${btoa(y)}`}k.appendChild(U),this.sendButton=k,k.addEventListener("mouseenter",()=>{k.style.backgroundColor="#E89FE8"}),k.addEventListener("mouseleave",()=>{k.style.backgroundColor="#FFAFFF"});const W=()=>{b.value.trim().length>0?(s.classList.add("is-typing"),k.style.display="flex",M.style.display="none"):(s.classList.remove("is-typing"),k.style.display="none",M.style.display="flex")};this.updateButtonsRef=W,b.addEventListener("input",()=>{X(),W()}),W(),v();const _=()=>{const r=b.value.trim();r&&(this.sendMessage(r),b.value="",l=1,V(),v(),W())};k.addEventListener("click",_),b.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),_())}),M.addEventListener("click",()=>{this.handleVoiceClick()});const N=document.createElement("div");N.className="small-chat-header",N.style.cssText=`
      height: 48px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      cursor: move;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    `;const z=document.createElement("div");z.className="small-chat-actions",z.style.cssText=`
      display: flex;
      align-items: center;
      gap: 4px;
    `;const I=document.createElement("button");I.className="small-chat-sidebar",I.type="button",I.setAttribute("aria-label","Sidebar"),I.style.cssText=`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    `;const j=document.createElement("img");j.alt="Sidebar",j.style.cssText=`
      width: 20px;
      height: 20px;
      opacity: 0.6;
    `;try{j.src=chrome.runtime.getURL("side-panel/icons/sidebar.svg")}catch{const y=`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.1667 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 15.5668 2.5 14.1667 2.5ZM14.1667 2.5V10V17.5" stroke="#858585" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="14.168" y="2.5" width="2.5" height="14.1667" fill="#858585"/>
      </svg>`;j.src=`data:image/svg+xml;base64,${btoa(y)}`}I.appendChild(j),I.addEventListener("mouseenter",()=>{I.style.backgroundColor="rgba(0, 0, 0, 0.05)"}),I.addEventListener("mouseleave",()=>{I.style.backgroundColor="transparent"}),I.addEventListener("click",async()=>{if(console.log("📱 Sidebar button clicked"),!this.isExtensionContextValid()){console.log("Extension context invalidated, cannot open sidebar"),this.handleExtensionReload();return}try{if(!this.currentSessionId&&this.messages.length>0){const y=await chrome.runtime.sendMessage({action:"createSession",title:this.messages[0].content.length>40?this.messages[0].content.substring(0,40)+"...":this.messages[0].content});if(y.success){this.currentSessionId=y.session.id;for(const C of this.messages)await chrome.runtime.sendMessage({action:"addMessage",sessionId:this.currentSessionId,message:{actor:C.actor,content:C.content,timestamp:C.timestamp,context:C.context}})}}console.log("🔄 Sending openSidePanel message with chatId:",this.currentSessionId);const r=await chrome.runtime.sendMessage({action:"openSidePanel",chatId:this.currentSessionId});if(console.log("📥 Full response from openSidePanel:",JSON.stringify(r,null,2)),r&&r.success)console.log("✅ Sidebar opened successfully, hiding small chat"),this.hide();else{const y=r!=null&&r.details?JSON.stringify(r.details,null,2):"No details",C=`${(r==null?void 0:r.error)||"Unknown error"}
Details: ${y}`;console.error("❌ Failed to open sidebar:",C),alert(`Failed to open sidebar: ${(r==null?void 0:r.error)||"Unknown error"}

This might be due to:
• Chrome version compatibility
• Extension permissions
• Tab restrictions

Try refreshing the page or restarting the browser.`)}}catch(r){console.error("❌ Exception opening sidebar:",r);let y="Failed to communicate with extension background script";if(r instanceof Error){if(y=r.message,r.message&&r.message.includes("Extension context invalidated")){this.handleExtensionReload();return}r.message.includes("Could not establish connection")?y="Extension background script not responding. Try reloading the extension.":r.message.includes("The message port closed")&&(y="Connection to extension lost. Try refreshing the page.")}alert(`Error opening sidebar: ${y}`)}});const R=document.createElement("button");R.className="small-chat-close",R.type="button",R.setAttribute("aria-label","Close"),R.style.cssText=`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      transition: background-color 0.2s ease;
    `;const O=document.createElement("img");O.alt="Close",O.style.cssText=`
      width: 20px;
      height: 20px;
      opacity: 0.6;
    `;try{O.src=chrome.runtime.getURL("side-panel/icons/x.svg")}catch{const y=`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3332 4.66699L4.6665 11.3337M4.6665 4.66699L11.3332 11.3337" stroke="#858585" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;O.src=`data:image/svg+xml;base64,${btoa(y)}`}R.appendChild(O),R.addEventListener("mouseenter",()=>{R.style.backgroundColor="rgba(0, 0, 0, 0.05)"}),R.addEventListener("mouseleave",()=>{R.style.backgroundColor="transparent"}),R.addEventListener("click",()=>{console.log("❌ Close button clicked"),this.hide()}),z.appendChild(I),z.appendChild(R),N.appendChild(z),this.makeDraggable(N),c.appendChild(u),h.appendChild(b),h.appendChild(L),h.appendChild(M),h.appendChild(k),c.appendChild(h),o.appendChild(c),d.appendChild(i),s.appendChild(d),s.appendChild(o),a.appendChild(s),e.appendChild(N),e.appendChild(t),e.appendChild(a),this.overlay.appendChild(e),document.body.appendChild(this.overlay),b.focus()}startVoiceActivityDetection(e){try{const t=new(window.AudioContext||window.webkitAudioContext),n=t.createMediaStreamSource(e),a=t.createAnalyser();a.fftSize=512,a.smoothingTimeConstant=.3,n.connect(a),this.audioContext=t,this.analyser=a,this.microphoneStream=e;const s=a.frequencyBinCount,o=new Uint8Array(s);let d=0,i=!1;const p=30,c=3e3,u=()=>{if(!this.isRecording||!this.analyser||this.silenceDetection)return;this.analyser.getByteFrequencyData(o);let h=0;for(let T=0;T<s;T++)h+=o[T];const l=h/s,m=Date.now();if(l>p)i=!0,d=m,this.voiceActivityTimeout&&(clearTimeout(this.voiceActivityTimeout),this.voiceActivityTimeout=null);else if(i&&m-d>c){console.log("Voice activity stopped, ending recording"),this.silenceDetection=!0,this.speechRecognition&&this.speechRecognition.stop();return}requestAnimationFrame(u)};u()}catch(t){console.error("Error setting up voice activity detection:",t)}}cleanupVoiceActivityDetection(){this.voiceActivityTimeout&&(clearTimeout(this.voiceActivityTimeout),this.voiceActivityTimeout=null),this.audioContext&&(this.audioContext.close(),this.audioContext=null),this.microphoneStream&&(this.microphoneStream.getTracks().forEach(e=>e.stop()),this.microphoneStream=null),this.analyser=null,this.silenceDetection=!1}async handleVoiceClick(){if(this.isRecording){this.speechRecognition&&this.speechRecognition.stop(),this.speechRecognitionTimeout&&(clearTimeout(this.speechRecognitionTimeout),this.speechRecognitionTimeout=null),this.cleanupVoiceActivityDetection(),this.isRecording=!1,this.updateVoiceButtonState();return}try{const e=await navigator.permissions.query({name:"microphone"});if(e.state==="denied"){this.addSystemMessage("Microphone access denied. Please enable microphone permissions in Chrome settings.");return}if(e.state!=="granted")try{(await navigator.mediaDevices.getUserMedia({audio:!0})).getTracks().forEach(o=>o.stop())}catch(s){console.error("Microphone permission denied:",s),this.addSystemMessage("Microphone access denied. Please allow microphone access to use voice input.");return}const t=await navigator.mediaDevices.getUserMedia({audio:!0});this.startVoiceActivityDetection(t);const n=window.SpeechRecognition||window.webkitSpeechRecognition;if(!n){this.addSystemMessage("Speech recognition is not supported in this browser. Please use Chrome.");return}this.speechRecognition=new n,this.speechRecognition&&(this.speechRecognition.continuous=!0,this.speechRecognition.lang="en-US",this.speechRecognition.interimResults=!0,this.speechRecognition.onstart=()=>{this.isRecording=!0,this.updateVoiceButtonState()},this.speechRecognition.onresult=s=>{let o="";for(let d=s.resultIndex;d<s.results.length;d++)s.results[d].isFinal&&(o+=s.results[d][0].transcript);o&&this.textarea&&(this.textarea.value+=o,this.isProcessingSpeech=!0,this.updateVoiceButtonState())},this.speechRecognition.onend=()=>{this.isRecording=!1,this.isProcessingSpeech=!1,this.updateVoiceButtonState(),this.cleanupVoiceActivityDetection()},this.speechRecognition.onerror=s=>{console.error("Speech recognition error:",s.error),this.isRecording=!1,this.isProcessingSpeech=!1,this.updateVoiceButtonState(),this.addSystemMessage("Speech recognition failed. Please try again."),this.cleanupVoiceActivityDetection()},this.speechRecognition.start());const a=2*60*1e3;this.speechRecognitionTimeout=window.setTimeout(()=>{this.speechRecognition&&this.speechRecognition.stop(),this.isRecording=!1,this.updateVoiceButtonState(),this.speechRecognitionTimeout=null,this.cleanupVoiceActivityDetection()},a)}catch(e){console.error("Error accessing microphone:",e);let t="Failed to access microphone. ";e instanceof Error&&(e.name==="NotAllowedError"?t+="Please grant microphone permission.":e.name==="NotFoundError"?t+="No microphone found.":t+=e.message),this.addSystemMessage(t),this.isRecording=!1,this.updateVoiceButtonState(),this.cleanupVoiceActivityDetection()}}updateVoiceButtonState(){if(!(!this.voiceButton||!this.voiceImg))if(this.isRecording){this.voiceButton.style.background="#FFAFFF",this.voiceButton.setAttribute("aria-label","Stop recording");try{this.voiceImg.src=chrome.runtime.getURL("side-panel/icons/stop.svg")}catch{const t=`<svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M3 7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>`;this.voiceImg.src=`data:image/svg+xml;base64,${btoa(t)}`}this.voiceImg.style.filter="none",this.voiceImg.style.width="16px",this.voiceImg.style.height="16px"}else{this.voiceButton.style.background="transparent",this.voiceButton.setAttribute("aria-label","Voice input");try{this.voiceImg.src=chrome.runtime.getURL("side-panel/icons/voice.svg")}catch{const t=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 8V16M7.5 9.5V15M12 5V19.5M16.5 3V21M21 10V14" stroke="#858585" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;this.voiceImg.src=`data:image/svg+xml;base64,${btoa(t)}`}this.voiceImg.style.filter="brightness(0) saturate(100%) invert(52%) sepia(0%) saturate(0%) hue-rotate(173deg) brightness(95%) contrast(85%)",this.voiceImg.style.width="24px",this.voiceImg.style.height="24px",this.updateButtonsRef&&this.updateButtonsRef()}}makeDraggable(e){let t=!1,n={x:0,y:0};e.addEventListener("mousedown",a=>{t=!0;const s=this.overlay.getBoundingClientRect();n={x:a.clientX-s.left,y:a.clientY-s.top}}),document.addEventListener("mousemove",a=>{if(t&&this.overlay){const s=a.clientX-n.x,o=a.clientY-n.y,d=window.innerWidth-400,i=window.innerHeight-600;this.overlay.style.left=`${Math.max(0,Math.min(s,d))}px`,this.overlay.style.top=`${Math.max(0,Math.min(o,i))}px`,this.overlay.style.right="auto",this.overlay.style.bottom="auto"}}),document.addEventListener("mouseup",()=>{t=!1})}async sendMessage(e){if(!this.isExtensionContextValid()){console.log("Extension context invalidated, cannot send message"),this.handleExtensionReload();return}const t={};this.selectedTabsContext.length>0&&(t.tabs=this.selectedTabsContext.map(s=>({title:s.tab.title,url:s.tab.url,content:s.content,summary:s.summary,favIconUrl:s.tab.favIconUrl})),console.log("💡 Adding tabs context to message:",t.tabs)),this.images.length>0&&(t.images=this.images.map(s=>({src:s.data,alt:s.name,width:16,height:16})),console.log("💡 Adding images context to message:",t.images));const n=Object.keys(t).length>0?t:void 0,a={actor:E.USER,content:e,timestamp:Date.now(),isUser:!0,context:n};if(this.messages.push(a),this.updateMessagesDisplay(),!this.currentSessionId)try{const s=await chrome.runtime.sendMessage({action:"createSession",title:e.length>40?e.substring(0,40)+"...":e});if(s.success)this.currentSessionId=s.session.id;else throw new Error(s.error)}catch(s){console.error("Failed to create session:",s),this.addSystemMessage("Failed to create chat session. Please try again.");return}try{console.log("💡 Final context being saved:",n),await chrome.runtime.sendMessage({action:"addMessage",sessionId:this.currentSessionId,message:{actor:E.USER,content:e,timestamp:Date.now(),context:n}}),chrome.runtime.sendMessage({action:"notifySidePanel",sessionId:this.currentSessionId,message:{actor:E.USER,content:e,timestamp:Date.now(),context:n}}).catch(()=>{})}catch(s){console.error("Failed to save user message:",s)}if(this.showLoadingIndicator(),this.port)try{let s=e;this.selectedTabsContext.length>0&&(s=`${`Here is some additional context from the user's selected browser tabs:

${this.selectedTabsContext.map(p=>{const c=(p.content??"").slice(0,5e3).trim();return`Title: ${p.tab.title}
URL: ${p.tab.url}
Summary: ${p.summary}
Content Snippet (truncated):
${c}`}).join(`

`)}

`}${e}`);const o={type:"simple_chat",message:s,tabId:await this.getCurrentTabId(),data:{text:s,tabs:this.selectedTabsContext.map(d=>({title:d.tab.title,url:d.tab.url,content:{title:d.tab.title,url:d.tab.url,content:d.content,headings:[],description:d.summary}})),images:this.images,chatHistory:this.messages.slice(-10).map(d=>({isUser:d.isUser,content:d.content}))}};this.port.postMessage(o),this.selectedTabsContext=[],this.images=[],this.updateContextDisplayFn&&this.updateContextDisplayFn()}catch(s){console.error("Failed to send message:",s),this.hideLoadingIndicator(),this.addSystemMessage("Failed to send message. Please try again.")}}async getCurrentTabId(){return new Promise((e,t)=>{chrome.runtime.sendMessage({action:"getCurrentTabId"},n=>{chrome.runtime.lastError?t(new Error(chrome.runtime.lastError.message)):n&&n.tabId?e(n.tabId):t(new Error("No tab ID received"))})})}async handleChatResponse(e){if(this.hideLoadingIndicator(),e.success){const t={actor:E.SYSTEM,content:e.response,timestamp:Date.now(),isUser:!1};if(this.messages.push(t),this.updateMessagesDisplay(),this.currentSessionId)try{await chrome.runtime.sendMessage({action:"addMessage",sessionId:this.currentSessionId,message:{actor:E.SYSTEM,content:e.response,timestamp:Date.now()}}),chrome.runtime.sendMessage({action:"notifySidePanel",sessionId:this.currentSessionId,message:{actor:E.SYSTEM,content:e.response,timestamp:Date.now()}}).catch(()=>{})}catch(n){console.error("Failed to save AI message:",n)}}else this.addSystemMessage(`Error: ${e.error}`)}addSystemMessage(e){const t={actor:E.SYSTEM,content:e,timestamp:Date.now(),isUser:!1};this.messages.push(t),this.updateMessagesDisplay()}showLoadingIndicator(){const e=document.getElementById("wonder-small-chat-messages");if(e){const t=document.createElement("div");t.id="wonder-loading-indicator",t.className="wonder-chat-message ai loading",t.style.cssText=`
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0;
        margin-left: 4px;
        margin-bottom: 4px;
      `,t.innerHTML=`
        <div class="wonder-chat-loading-dot" style="width: 6px; height: 6px; border-radius: 50%; background: #7F7F7F; animation: loadingBounce 1.4s ease-in-out infinite;"></div>
        <div class="wonder-chat-loading-dot" style="width: 6px; height: 6px; border-radius: 50%; background: #7F7F7F; animation: loadingBounce 1.4s ease-in-out infinite; animation-delay: 0.2s;"></div>
        <div class="wonder-chat-loading-dot" style="width: 6px; height: 6px; border-radius: 50%; background: #7F7F7F; animation: loadingBounce 1.4s ease-in-out infinite; animation-delay: 0.4s;"></div>
        <style>
          @keyframes loadingBounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-4px);
              opacity: 1;
            }
          }
        </style>
      `,e.appendChild(t),e.scrollTop=e.scrollHeight}}hideLoadingIndicator(){const e=document.getElementById("wonder-loading-indicator");e&&e.remove()}updateMessagesDisplay(){const e=document.getElementById("wonder-small-chat-messages");if(!e)return;const t=document.getElementById("wonder-loading-indicator");e.innerHTML="",t&&e.appendChild(t),this.messages.forEach(n=>{console.log("🔍 Message debug:",{isUser:n.isUser,hasContext:!!n.context,context:n.context,content:n.content.substring(0,50)}),n.isUser&&n.context&&console.log("💡 Rendering message with context:",n.content.substring(0,50),n.context);const a=document.createElement("div");a.className=`wonder-chat-message ${n.isUser?"user":"ai"}`,a.style.cssText=`
        margin-bottom: 4px;
        line-height: 1.5;
        font-size: 15px;
        padding: 12px 16px;
        border-radius: 12px;
        width: fit-content;
        ${n.isUser?"background: #FFFFFF; margin-left: auto; margin-right: 0; border-bottom-right-radius: 4px; color: #000000; max-width: 75%;":"background: transparent; margin-right: auto; margin-left: -8px; border-bottom-left-radius: 4px; padding: 12px 12px 12px 12px; color: #000000; max-width: 100%;"}
      `;const s=document.createElement("div");if(n.isUser&&n.context){console.log("💡 Creating context div for message:",n.context);const d=document.createElement("div");if(d.style.cssText=`
          margin-bottom: 8px;
          padding: 8px;
          background: rgba(236, 72, 153, 0.1);
          border-radius: 6px;
          border-left: 3px solid #ec4899;
        `,n.context.tabs&&n.context.tabs.length>0){console.log("💡 Adding tabs to context display:",n.context.tabs);const i=document.createElement("div");i.style.cssText=`
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            margin-bottom: 4px;
          `;const p=n.context.tabs.slice(0,2),c=n.context.tabs.length-2;if(p.forEach(u=>{const h=document.createElement("div");h.style.cssText=`
              display: flex;
              align-items: center;
              background: #f5f5f5;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 12px;
              color: #000000;
              min-width: 0;
            `,h.innerHTML=`
              <img src="${u.favIconUrl||"./icons/smallchat.svg"}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0;" />
              <span class="context-x" style="display: none; margin-right: 8px; color: #858585; flex-shrink: 0; font-size: 14px; line-height: 1;">×</span>
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${u.title}</span>
            `,i.appendChild(h)}),d.appendChild(i),c>0){const u=document.createElement("button");u.type="button",u.style.cssText=`
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f5f5f5;
              border: none;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 12px;
              color: #000000;
              cursor: pointer;
              transition: background-color 0.2s ease;
              width: 32px;
              height: 24px;
            `,u.textContent=`+${c}`,u.addEventListener("click",()=>{u.textContent==="-"?(i.innerHTML="",p.forEach(h=>{const l=document.createElement("div");l.style.cssText=`
                    display: flex;
                    align-items: center;
                    background: #f5f5f5;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 12px;
                    color: #000000;
                    min-width: 0;
                  `,l.innerHTML=`
                    <img src="${h.favIconUrl||"./icons/smallchat.svg"}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0;" />
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${h.title}</span>
                  `,i.appendChild(l)}),u.textContent=`+${c}`):(i.innerHTML="",n.context.tabs.forEach(h=>{const l=document.createElement("div");l.style.cssText=`
                    display: flex;
                    align-items: center;
                    background: #f5f5f5;
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 12px;
                    color: #000000;
                    min-width: 0;
                  `,l.innerHTML=`
                    <img src="${h.favIconUrl||"./icons/smallchat.svg"}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0;" />
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${h.title}</span>
                  `,i.appendChild(l)}),u.textContent="-")}),u.addEventListener("mouseenter",()=>{u.style.backgroundColor="#e5e5e5"}),u.addEventListener("mouseleave",()=>{u.style.backgroundColor="#f5f5f5"}),d.appendChild(u)}}if(n.context.images&&n.context.images.length>0){console.log("💡 Adding images to context display:",n.context.images);const i=document.createElement("div");i.style.cssText=`
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
            margin-top: ${n.context.tabs&&n.context.tabs.length>0?"4px":"0px"};
          `,n.context.images.forEach(p=>{const c=document.createElement("div");c.style.cssText=`
              display: flex;
              align-items: center;
              background: #f5f5f5;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 12px;
              color: #000000;
              min-width: 0;
            `,c.innerHTML=`
              <img src="${p.src||p.data}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0; object-fit: cover;" />
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${p.alt||p.name}</span>
            `,i.appendChild(c)}),d.appendChild(i)}s.appendChild(d)}const o=document.createElement("div");n.isUser?o.textContent=n.content:o.innerHTML=this.parseMarkdown(n.content),s.appendChild(o),a.appendChild(s),e.appendChild(a)}),e.scrollTop=e.scrollHeight}parseMarkdown(e){return!e||typeof e!="string"?e:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/```([\s\S]*?)```/g,'<pre style="background: rgba(0,0,0,0.1); padding: 8px; border-radius: 4px; margin: 4px 0;"><code>$1</code></pre>').replace(/`([^`]+)`/g,'<code style="background: rgba(0,0,0,0.1); padding: 2px 4px; border-radius: 2px;">$1</code>').replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" style="color: #007AFF;">$1</a>')}isExtensionContextValid(){try{return!!(chrome.runtime&&chrome.runtime.id)}catch{return!1}}handleExtensionReload(){console.log("🔄 Extension was reloaded, cleaning up small chat..."),this.port=null,this.isVisible&&this.hide(),this.showExtensionReloadMessage()}showExtensionReloadMessage(){const e=document.createElement("div");e.style.cssText=`
      all: initial;
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 14px;
      z-index: 999999;
      animation: wonderFadeIn 0.3s ease-out;
      box-sizing: border-box;
      margin: 0;
      border: none;
      outline: none;
      line-height: 1.4;
      text-align: left;
      text-decoration: none;
      text-transform: none;
      letter-spacing: normal;
      word-spacing: normal;
      text-shadow: none;
      vertical-align: baseline;
      white-space: normal;
      word-wrap: normal;
      direction: ltr;
      unicode-bidi: normal;
    `,e.textContent="Extension updated. Please refresh the page to restore full functionality.",document.body.appendChild(e),setTimeout(()=>{e.parentNode&&e.remove()},5e3)}async fetchTabs(){try{const e=await chrome.runtime.sendMessage({action:"getTabs"});e.success?this.tabs=e.tabs:(console.error("Failed to get tabs:",e.error),this.tabs=[])}catch(e){console.error("Error fetching tabs:",e),this.tabs=[]}}createPlusPopup(){var a;this.plusPopupElement&&this.plusPopupElement.remove(),this.plusPopupElement=document.createElement("div"),this.plusPopupElement.className="plus-popup",this.plusPopupElement.style.cssText=`
      position: absolute;
      bottom: 100%;
      left: 0;
      margin-bottom: 8px;
      background: white;
      border-radius: 8px;
      width: 240px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 50;
      scrollbar-width: none;
      -ms-overflow-style: none;
      animation: popupFadeIn 0.2s ease-out;
      color: #000000;
    `;const e=document.createElement("div");e.style.cssText=`
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `,this.fileInputElement||(this.fileInputElement=document.createElement("input"),this.fileInputElement.type="file",this.fileInputElement.accept="image/*",this.fileInputElement.multiple=!0,this.fileInputElement.style.display="none",this.fileInputElement.addEventListener("change",s=>this.handleFileChange(s)),document.body.appendChild(this.fileInputElement));const t=document.createElement("button");t.type="button",t.style.cssText=`
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px;
      border-radius: 6px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      color: #000000;
      transition: background-color 0.2s ease;
    `,t.innerHTML=`
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #FFAFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        transition: background-color 0.2s ease;
      ">
        <svg width="16" height="16" fill="white" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
      </div>
      <span>Add Image</span>
    `,t.addEventListener("mouseenter",()=>{var o;t.style.backgroundColor="#FFAFFF",t.style.color="white";const s=t.querySelector("div");s&&(s.style.backgroundColor="white",(o=s.querySelector("svg"))==null||o.setAttribute("fill","#FFAFFF"))}),t.addEventListener("mouseleave",()=>{var o;t.style.backgroundColor="transparent",t.style.color="inherit";const s=t.querySelector("div");s&&(s.style.backgroundColor="#FFAFFF",(o=s.querySelector("svg"))==null||o.setAttribute("fill","white"))}),t.addEventListener("click",()=>{var s;(s=this.fileInputElement)==null||s.click(),this.hidePlusPopup()}),e.appendChild(t),this.tabs.forEach(s=>{const o=document.createElement("button");o.type="button",o.style.cssText=`
        width: 100%;
        display: flex;
        align-items: center;
        padding: 8px;
        border-radius: 6px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        color: #000000;
        text-align: left;
        transition: background-color 0.2s ease;
      `;const d=this.selectedTabsContext.some(i=>i.tab.id===s.id);d&&(o.style.backgroundColor="rgba(255, 175, 255, 0.5)",o.style.borderColor="#FFAFFF",o.style.border="1px solid #FFAFFF"),o.innerHTML=`
        <img src="${s.favIconUrl}" style="width: 16px; height: 16px; margin-right: 12px; border-radius: 2px;" onerror="this.src='${chrome.runtime.getURL("side-panel/icons/smallchat.svg")}'">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.title}</span>
      `,o.addEventListener("mouseenter",()=>{d||(o.style.backgroundColor="rgba(0, 0, 0, 0.05)")}),o.addEventListener("mouseleave",()=>{d?(o.style.backgroundColor="rgba(255, 175, 255, 0.5)",o.style.borderColor="#FFAFFF",o.style.border="1px solid #FFAFFF"):o.style.backgroundColor="transparent"}),o.addEventListener("click",()=>this.handleTabSelect(s)),e.appendChild(o)}),this.plusPopupElement.appendChild(e);const n=(a=document.querySelector(".small-chat-plus-circle"))==null?void 0:a.parentElement;n&&n.appendChild(this.plusPopupElement),document.addEventListener("click",this.handleClickOutside.bind(this))}hidePlusPopup(){this.showPlusPopup=!1,this.plusPopupElement&&(this.plusPopupElement.remove(),this.plusPopupElement=null),document.removeEventListener("click",this.handleClickOutside.bind(this))}handleClickOutside(e){if(this.plusPopupElement&&!this.plusPopupElement.contains(e.target)){const t=document.querySelector(".small-chat-plus-circle");t&&!t.contains(e.target)&&this.hidePlusPopup()}}handleFileChange(e){const t=e.target;Array.from(t.files||[]).forEach(a=>{const s=new FileReader;s.onload=o=>{var d;this.images.push({data:(d=o.target)==null?void 0:d.result,name:a.name,type:a.type}),this.updateContextDisplayFn&&this.updateContextDisplayFn()},s.readAsDataURL(a)})}async handleTabSelect(e){const t=this.selectedTabsContext.findIndex(n=>n.tab.id===e.id);if(t!==-1)this.selectedTabsContext.splice(t,1);else{const n=await this.extractTabContent(e);this.selectedTabsContext.push(n)}this.updateContextDisplayFn&&this.updateContextDisplayFn(),this.createPlusPopup()}async extractTabContent(e){var t;try{const n=await chrome.runtime.sendMessage({action:"extractTabContent",tabId:e.id});if(n.success&&n.content){const a=`${n.content.title}${((t=n.content.headings)==null?void 0:t.length)>0?" - "+n.content.headings.join(", "):""}`.slice(0,100);return{tab:e,content:n.content.bodyText||`Content from ${e.title}`,summary:a||e.title}}}catch(n){console.error("Error extracting tab content:",n)}return{tab:e,content:`Content from ${e.title}`,summary:e.title}}createMessageContextDisplay(e){const t=document.createElement("div"),n=a=>{t.innerHTML="";const s=a?e:e.slice(0,2),o=e.length-2,d=document.createElement("div");if(d.style.cssText=`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        margin-bottom: ${!a&&o>0?"4px":"0px"};
      `,s.forEach(i=>{const p=document.createElement("div");p.style.cssText=`
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          color: #000000;
          min-width: 0;
        `,i.type==="tab"?p.innerHTML=`
            <img src="${i.data.favIconUrl||"./icons/smallchat.svg"}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0;" />
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${i.data.title}</span>
          `:p.innerHTML=`
            <img src="${i.data.src}" style="width: 16px; height: 16px; border-radius: 2px; margin-right: 8px; flex-shrink: 0; object-cover: cover;" />
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; color: #000000;">${i.data.alt}</span>
          `,d.appendChild(p)}),t.appendChild(d),!a&&o>0){const i=document.createElement("button");i.type="button",i.style.cssText=`
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          color: #000000;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 32px;
          height: 24px;
        `,i.textContent=`+${o}`,i.addEventListener("mouseenter",()=>{i.style.backgroundColor="#e5e5e5"}),i.addEventListener("mouseleave",()=>{i.style.backgroundColor="#f5f5f5"}),i.addEventListener("click",()=>{n(!0)}),t.appendChild(i)}else if(a&&e.length>2){const i=document.createElement("button");i.type="button",i.style.cssText=`
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          color: #000000;
          cursor: pointer;
          transition: background-color 0.2s ease;
          width: 32px;
          height: 24px;
          margin-top: 4px;
        `,i.textContent="-",i.addEventListener("mouseenter",()=>{i.style.backgroundColor="#e5e5e5"}),i.addEventListener("mouseleave",()=>{i.style.backgroundColor="#f5f5f5"}),i.addEventListener("click",()=>{n(!1)}),t.appendChild(i)}};return n(!1),t}}window.wonderSmallChatOverlay||(window.wonderSmallChatOverlay=new A,console.log("Wonder small chat overlay initialized")),console.log("content script loaded"),window.wonderSearchOverlay=void 0;function D(g,e,t){const n=document.querySelector("#wonder-context-popup");n&&n.remove();const a=document.createElement("div");a.id="wonder-context-popup",a.style.cssText=`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #FFFFFF;
    border-radius: 4px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    ${t==="loading"?"width: auto; padding: 12px;":"max-width: 500px; max-height: 400px; padding: 12px 12px 4px 12px;"}
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    animation: wonderPopupFadeIn 0.3s ease-out;
    display: flex;
    flex-direction: column;
    ${t==="loading"?"gap: 0;":"gap: 12px;"}
  `;const s=document.createElement("style");s.textContent=`
    @keyframes wonderPopupFadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,document.head.appendChild(s);const o=document.createElement("div");if(t==="loading"){o.style.cssText=`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      width: 100%;
    `;const l=document.createElement("div");l.style.cssText=`
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      line-height: 1.5;
      color: #2c2c2c;
    `,l.innerHTML=`
      <div style="width: 16px; height: 16px; border: 2px solid #FFAFFF; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <span>Processing your request...</span>
    `;const m=document.createElement("button");m.style.cssText=`
      background: none;
      border: none;
      cursor: pointer;
      color: #858585;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      flex-shrink: 0;
    `,m.innerHTML=`<img src="${chrome.runtime.getURL("side-panel/icons/x.svg")}" style="width: 14px; height: 14px;" alt="Close" />`,m.onclick=()=>a.remove(),o.appendChild(l),o.appendChild(m)}else{o.style.cssText=`
      position: relative;
      flex: 1;
    `;const l=document.createElement("button");l.style.cssText=`
      position: absolute;
      top: 4px;
      right: 4px;
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #858585;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      z-index: 1;
    `,l.innerHTML=`<img src="${chrome.runtime.getURL("side-panel/icons/x.svg")}" style="width: 14px; height: 14px;" alt="Close" />`,l.onclick=()=>a.remove();const m=document.createElement("div");m.style.cssText=`
      font-size: 14px;
      line-height: 1.5;
      color: ${t==="error"?"#DC3545":"#2c2c2c"};
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
      padding-right: 24px;
    `,m.textContent=e,o.appendChild(m),o.appendChild(l)}const d=document.createElement("div");d.style.cssText=`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  `;const i=document.createElement("button");i.style.cssText=`
    background: none;
    border: none;
    color: #2c2c2c;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s ease;
  `,i.innerHTML=`
    <img src="${chrome.runtime.getURL("side-panel/icons/askwonder.svg")}" style="width: 14px; height: 14px;" alt="Ask Wonder" />
    Ask Wonder
  `,i.onmouseover=()=>i.style.backgroundColor="#F5F5F5",i.onmouseout=()=>i.style.backgroundColor="transparent",i.onclick=async()=>{try{a.remove();const l=await chrome.runtime.sendMessage({action:"createContextSession",originalText:g,aiResponse:e,actionType:"context_menu"});l.success?await chrome.runtime.sendMessage({action:"openSidePanel",chatId:l.sessionId}):console.error("Failed to create context session:",l.error)}catch(l){console.error("Failed to open sidebar with context:",l)}};const p=document.createElement("div");p.style.cssText=`
    display: flex;
    gap: 0;
  `;const c=document.createElement("button");c.style.cssText=`
    background: none;
    border: none;
    color: #2c2c2c;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s ease;
  `,c.innerHTML=`
    <img src="${chrome.runtime.getURL("side-panel/icons/copy-03.svg")}" style="width: 14px; height: 14px;" alt="Copy" />
    Copy
  `,c.onmouseover=()=>c.style.backgroundColor="#F5F5F5",c.onmouseout=()=>c.style.backgroundColor="transparent",c.onclick=()=>{navigator.clipboard.writeText(e).then(()=>{c.innerHTML=`<img src="${chrome.runtime.getURL("side-panel/icons/copy-03.svg")}" style="width: 14px; height: 14px;" alt="Copy" /> Copied`,setTimeout(()=>{c.innerHTML=`<img src="${chrome.runtime.getURL("side-panel/icons/copy-03.svg")}" style="width: 14px; height: 14px;" alt="Copy" /> Copy`},1500)})};const u=document.createElement("button");u.style.cssText=`
    background: none;
    border: none;
    color: #2c2c2c;
    font-size: 14px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s ease;
  `,u.innerHTML=`
    <img src="${chrome.runtime.getURL("side-panel/icons/refresh-cw-05.svg")}" style="width: 14px; height: 14px;" alt="Retry" />
    Retry
  `,u.onmouseover=()=>u.style.backgroundColor="#F5F5F5",u.onmouseout=()=>u.style.backgroundColor="transparent",u.onclick=async()=>{try{const l=o.querySelector("div:first-child");l&&(l.innerHTML=`
          <div style="display: flex; align-items: center; gap: 8px; color: #2c2c2c;">
            <div style="width: 16px; height: 16px; border: 2px solid #FFAFFF; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span>Retrying...</span>
          </div>
        `);const m=await chrome.runtime.sendMessage({action:"retryContextAction",originalText:g,actionType:t==="response"?"retry":t});m.success&&l?(l.style.color="#2c2c2c",l.textContent=m.response,e=m.response,c.onclick=()=>{navigator.clipboard.writeText(m.response).then(()=>{c.innerHTML=`<img src="${chrome.runtime.getURL("side-panel/icons/copy-03.svg")}" style="width: 14px; height: 14px;" alt="Copy" /> Copied`,setTimeout(()=>{c.innerHTML=`<img src="${chrome.runtime.getURL("side-panel/icons/copy-03.svg")}" style="width: 14px; height: 14px;" alt="Copy" /> Copy`},1500)})},i.onclick=async()=>{try{a.remove();const T=await chrome.runtime.sendMessage({action:"createContextSession",originalText:g,aiResponse:m.response,actionType:"context_menu"});T.success?await chrome.runtime.sendMessage({action:"openSidePanel",chatId:T.sessionId}):console.error("Failed to create context session:",T.error)}catch(T){console.error("Failed to open sidebar with context:",T)}}):l&&(l.style.color="#DC3545",l.textContent=m.error||"Failed to retry. Please try again.")}catch(l){console.error("Failed to retry:",l);const m=o.querySelector("div:first-child");m&&(m.style.color="#DC3545",m.textContent="Failed to retry. Please try again.")}},p.appendChild(c),p.appendChild(u),d.appendChild(i),d.appendChild(p),t==="response"?(a.appendChild(o),a.appendChild(d)):a.appendChild(o),document.body.appendChild(a),(t==="loading"||t==="error")&&setTimeout(()=>{a.parentNode&&a.remove()},t==="loading"?3e4:5e3);const h=l=>{a.contains(l.target)||(a.remove(),document.removeEventListener("click",h))};setTimeout(()=>{document.addEventListener("click",h)},100)}function q(g){var e,t,n;try{const a=Array.from(document.querySelectorAll(`
      input[type="text"]:not([readonly]):not([disabled]),
      input[type="email"]:not([readonly]):not([disabled]),
      input[type="search"]:not([readonly]):not([disabled]),
      input:not([type]):not([readonly]):not([disabled]),
      textarea:not([readonly]):not([disabled]),
      [contenteditable="true"]:not([readonly]):not([disabled]),
      [contenteditable=""]:not([readonly]):not([disabled])
    `));if(a.length===0)return console.warn("No suitable input elements found for injection"),!1;const s=window.getSelection();let o=null,d=-1;if(s&&s.rangeCount>0){const c=s.getRangeAt(0).getBoundingClientRect(),u={x:c.left+c.width/2,y:c.top+c.height/2};for(const h of a){const l=h.getBoundingClientRect();if(l.width===0||l.height===0)continue;const m={x:l.left+l.width/2,y:l.top+l.height/2};let S=1e3-Math.sqrt(Math.pow(u.x-m.x,2)+Math.pow(u.y-m.y,2));S+=Math.min(l.width*l.height/1e3,100);const B=((e=h.getAttribute("placeholder"))==null?void 0:e.toLowerCase())||"",V=h.className.toLowerCase(),b=h.id.toLowerCase(),L=((t=h.getAttribute("aria-label"))==null?void 0:t.toLowerCase())||"",Y=((n=h.getAttribute("name"))==null?void 0:n.toLowerCase())||"",v=[B,V,b,L,Y].join(" ");(v.includes("reply")||v.includes("response")||v.includes("compose")||v.includes("write")||v.includes("comment")||v.includes("message")||v.includes("answer")||v.includes("feedback")||v.includes("email")||v.includes("mail"))&&(S+=300),(h.closest("form")||h.getAttribute("role")==="textbox")&&(S+=100),(v.includes("search")||v.includes("find")||v.includes("query")||v.includes("filter")||v.includes("lookup")||v.includes("browse"))&&(S-=200),(l.width<100||l.height<25)&&(S-=100),h.tagName.toLowerCase()==="textarea"&&(S+=150),h.getAttribute("contenteditable")&&(S+=75),S>d&&(d=S,o=h)}}if(!o&&a.length>0&&(o=a.find(p=>{const c=p.getBoundingClientRect();return c.width>0&&c.height>0})||a[0]),!o)return console.warn("No suitable target element found for injection"),!1;if(o.tagName.toLowerCase()==="textarea"||o.tagName.toLowerCase()==="input"){const p=o;p.focus(),p.value=g,p.dispatchEvent(new Event("input",{bubbles:!0})),p.dispatchEvent(new Event("change",{bubbles:!0})),p.setSelectionRange(g.length,g.length)}else if(o.getAttribute("contenteditable")){o.focus(),o.textContent=g,o.dispatchEvent(new Event("input",{bubbles:!0}));const p=document.createRange(),c=window.getSelection();p.selectNodeContents(o),p.collapse(!1),c==null||c.removeAllRanges(),c==null||c.addRange(p)}console.log("✅ Response injected into input element:",o.tagName,o.className);const i=o.style.border;return o.style.border="2px solid #FFAFFF",setTimeout(()=>{o.style.border=i},1e3),!0}catch(a){return console.error("Error injecting response into input:",a),!1}}chrome.runtime.onMessage.addListener(async(g,e,t)=>{if(console.log("Content script received message:",g.action),g.action==="ping"){console.log("🏓 Content script ping received");const n={ready:!0,url:window.location.href,title:document.title,timestamp:Date.now(),capabilities:{buildDomTree:typeof window.buildDomTree=="function",searchOverlay:!!window.wonderSearchOverlay,smallChat:!!window.wonderSmallChatOverlay},pageState:{readyState:document.readyState,visible:!document.hidden,hasFocus:document.hasFocus(),elementCount:document.querySelectorAll("*").length,scrollable:document.documentElement.scrollHeight>window.innerHeight}};return t({success:!0,status:n}),!0}else{if(g.action==="toggle-search")return t({success:!1,error:"Search overlay disabled"}),!0;if(g.action==="showContextLoading")return console.log("🔄 Content: Showing context loading for:",g.actionType),D(g.text,"Loading...","loading"),t({success:!0}),!0;if(g.action==="showContextResponse")return console.log("✅ Content: Showing context response for:",g.actionType),D(g.originalText,g.response,"response"),t({success:!0}),!0;if(g.action==="showContextError")return console.log("❌ Content: Showing context error:",g.error),D("",g.error,"error"),t({success:!0}),!0;if(g.action==="injectResponse"){console.log("💬 Content: Injecting response into nearby input");const n=q(g.response);return t({success:n}),!0}}return!1})})();
