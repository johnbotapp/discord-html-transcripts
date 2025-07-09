// TODO: create some sort of build system to compile this file

/*
   // copy message id to clipboard
   const contextMenu = document.getElementById('context-menu');
   document.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      const target = e.target;
      if (!target) return;

      const message = target.closest("discord-message")
      if (!message) {
        contextMenu?.classList.remove('visible');
        return;
      }

      const isProfile = target?.closest('.discord-author-avatar img');

      const goto = isProfile ? message?.getAttribute('profile') : message?.getAttribute('id')?.split('-')[1];
      if (!goto) {
        contextMenu?.classList.remove('visible');
        return;
      }

      if (isProfile) {
        contextMenu?.querySelector('.item.message')?.classList.add('hidden');
        contextMenu?.querySelector('.item.user')?.classList.remove('hidden');
      } else {
        contextMenu?.querySelector('.item.user')?.classList.add('hidden');
        contextMenu?.querySelector('.item.message')?.classList.remove('hidden');
      }

      if (goto && contextMenu) {
        contextMenu.classList.add('visible');
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.style.left = e.pageX + 'px';

        const copyId = contextMenu.querySelector(isProfile ? '.item.user' : '.item.message');
        if (copyId) {
          copyId.addEventListener('click', () => {
            navigator.clipboard.writeText(goto);
            contextMenu.classList.remove('visible');
          }, { once: true });
        }
      }
   });

  // whenever user clicks on element with data-goto attribute, scroll to that message
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    if (!target.offsetParent?.classList.contains('context-menu')) {
      contextMenu?.classList.remove('visible');
    }

    const goto = target?.getAttribute('data-goto');

    if (goto) {
      const message = document.getElementById(`m-${goto}`);
      if (message) {
        message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        message.style.backgroundColor = 'rgba(148, 156, 247, 0.1)';
        message.style.transition = 'background-color 0.5s ease';
        setTimeout(() => {
          message.style.backgroundColor = 'transparent';
        }, 1000);
      } else {
        console.warn(`Message ${goto} not found.`);
      }
    }
  });

  // reveal spoiler
  const spoilers = document.querySelectorAll('.discord-spoiler');
  spoilers.forEach(spoiler => {
    spoiler.addEventListener('click', () => {
      if (spoiler.classList.contains('discord-spoiler')) {
        spoiler.classList.remove('discord-spoiler');
        spoiler.classList.add('discord-spoiler--revealed');
      }
    });
  });
*/

export const contextMenu =
  'const contextMenu=document.getElementById("context-menu");document.addEventListener("contextmenu",e=>{e.preventDefault();let t=e.target;if(!t)return;let s=t.closest("discord-message");if(!s){contextMenu?.classList.remove("visible");return}let n=t?.closest(".discord-author-avatar img"),i=n?s?.getAttribute("profile"):s?.getAttribute("id")?.split("-")[1];if(!i){contextMenu?.classList.remove("visible");return}if(n?(contextMenu?.querySelector(".item.message")?.classList.add("hidden"),contextMenu?.querySelector(".item.user")?.classList.remove("hidden")):(contextMenu?.querySelector(".item.user")?.classList.add("hidden"),contextMenu?.querySelector(".item.message")?.classList.remove("hidden")),i&&contextMenu){contextMenu.classList.add("visible"),contextMenu.style.top=e.pageY+"px",contextMenu.style.left=e.pageX+"px";let c=contextMenu.querySelector(n?".item.user":".item.message");c&&c.addEventListener("click",()=>{navigator.clipboard.writeText(i),contextMenu.classList.remove("visible")},{once:!0})}});';

export const scrollToMessage =
  'document.addEventListener("click",t=>{let e=t.target;if(!e)return;e.offsetParent?.classList.contains("context-menu")||contextMenu?.classList.remove("visible");let o=e?.getAttribute("data-goto");if(o){let n=document.getElementById(`m-${o}`);n?(n.scrollIntoView({behavior:"smooth",block:"center"}),n.style.backgroundColor="rgba(148, 156, 247, 0.1)",n.style.transition="background-color 0.5s ease",setTimeout(()=>{n.style.backgroundColor="transparent"},1e3)):console.warn(`Message ${o} not found.`)}});';

export const revealSpoiler =
  'const spoilers=document.querySelectorAll(".discord-spoiler");spoilers.forEach(s=>{s.addEventListener("click",()=>{s.classList.contains("discord-spoiler")&&(s.classList.remove("discord-spoiler"),s.classList.add("discord-spoiler--revealed"))})});';
