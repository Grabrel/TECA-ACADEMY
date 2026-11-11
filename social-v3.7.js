/* Teca Academia 3.7 — Companheiros, Perfil, Chat. Sem serviços externos além do Supabase existente. */
(()=>{
'use strict';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
const avatarIcons=['📚','🦉','🌱','🧠','✒️','🦊'];
const rooms=[['geral','Geral'],['portugues','Português'],['direito','Direito'],['informatica','Informática'],['logica','Raciocínio lógico'],['matematica','Matemática'],['redacao','Redação']];
const state={client:null,user:null,self:null,ready:false,setupError:'',friends:[],people:new Map(),results:[],progress:new Map(),avatarURLs:new Map(),page:'',edit:false,searchTerm:'',chatRoom:'geral',chatPeer:null,messages:[],busy:false,info:'',error:'',drawer:false,channel:null,requestCounter:0};
const id=()=>state.user?.id;
function msg(err){return err?.message||String(err||'Ocorreu um erro.');}
function showError(err){state.error=msg(err);renderContent();}
const total=()=>Number(window.TECA_LESSONS?.length||0);
const initials=(name='')=>String(name).trim().split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase()||'•';
function person(uid){return uid===id()?state.self:(state.people.get(uid)||{id:uid,full_name:'Participante',username:''});}
function avatarHTML(p,size='normal'){
 const src=p?.avatar_path?state.avatarURLs.get(p.avatar_path):null;
 return `<span class="social-avatar ${size==='small'?'small':''}" aria-hidden="true">${src?`<img src="${e(src)}" alt="">`:e(p?.avatar_icon||initials(p?.full_name))}</span>`;
}
function getMyStats(){const x=window.TECA_SOCIAL_STATS?.()||{};return {completed:Number(x.completed||0),total:total(),xp:Number(x.xp||0),level:Number(x.level||1),streak:Number(x.streak||0)}}
function bar(done,max){const n=Math.min(100,Math.max(0,max?100*done/max:0));return `<div class="social-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(n)}"><span style="width:${n.toFixed(1)}%"></span></div>`;}
function badge(txt){return `<span class="social-tag">${e(txt)}</span>`;}
function textBox(text='',isError=false){return text?`<div class="social-alert ${isError?'error':''}" role="status">${e(text)}</div>`:'';}
async function signAvatars(people){
 const paths=[...new Set(people.map(p=>p?.avatar_path).filter(Boolean))];
 await Promise.all(paths.map(async path=>{
  if(state.avatarURLs.has(path))return;
  const {data,error}=await state.client.storage.from('teca-avatars').createSignedUrl(path,900);
  if(!error&&data?.signedUrl)state.avatarURLs.set(path,data.signedUrl);
 }));
}
async function init({client,user,profile}){
 state.client=client;state.user=user;
 try{
  const {data,error}=await client.from('profiles').select('id,full_name,username,bio,avatar_path,avatar_icon,discoverable,allow_requests,share_progress').eq('id',user.id).single();
  if(error)throw error;
  state.self=data;state.ready=true;state.setupError='';
  await signAvatars([data]);updateHeader();
  refreshDrawerBadge().catch(()=>{});
 }catch(err){state.ready=false;state.setupError=msg(err);console.warn('Teca Social: execute a migração 3.7 antes de usar os recursos sociais.',err);}
}
function updateHeader(){const btn=$('#social-profile-shortcut');if(!btn)return;btn.innerHTML=avatarHTML(state.self,'small')+'<span>Perfil</span>';btn.title='Abrir meu perfil';}
function setupHTML(){return `<div class="social-not-configured"><h2>Ative a comunidade no Supabase</h2><p>O site 3.7 já foi atualizado, mas o banco ainda precisa da migração <code>20261111000300_companheiros_perfil.sql</code>.</p><p>O login e o estudo continuam funcionando normalmente. Execute a migração no SQL Editor e recarregue a página.</p><p class="muted small">Detalhe técnico: ${e(state.setupError)}</p></div>`;}
function renderPage(page){state.page=page;return `<section class="social-page"><div class="social-heading"><span class="eyebrow">COMUNIDADE DE APRENDIZAGEM</span><h1>${page==='profile'?'Meu perfil':page==='chat'?'Sala de dúvidas e conversas':'Companheiros'}</h1><p class="lead">${page==='profile'?'Seu espaço, sua evolução e suas escolhas de privacidade.':page==='chat'?'Tire dúvidas sobre as matérias e converse com seus companheiros.':'Encontre colegas, construa sua rede e acompanhe o progresso que eles escolherem compartilhar.'}</p></div><div id="social-content">${state.ready?'<p class="muted">Carregando…</p>':setupHTML()}</div></section>`;}
async function mount(page){state.page=page;state.error='';state.info='';if(!state.ready){renderContent();return;} if(page!=='chat')stopRealtime(); if(page==='profile')await loadProfile(); if(page==='companions')await loadFriends(true); if(page==='chat'){await loadFriends(false);await loadChat();}}
function renderContent(){const root=$('#social-content');if(!root)return;root.innerHTML=!state.ready?setupHTML():textBox(state.error,true)+textBox(state.info)+(
 state.page==='profile'?profileHTML():state.page==='companions'?companionsHTML():chatHTML());}
async function loadProfile(){const {data,error}=await state.client.from('profiles').select('id,full_name,username,bio,avatar_path,avatar_icon,discoverable,allow_requests,share_progress').eq('id',id()).single();if(error){showError(error);return;}state.self=data;await signAvatars([data]);updateHeader();renderContent();}
function profileHTML(){const p=state.self||{},s=getMyStats();return `<div class="social-profile-grid">
 <div class="social-card social-profile-main"><div class="social-profile-intro"><div class="social-big-avatar">${avatarHTML(p)}<button type="button" class="social-mini-photo" data-social-action="choose-photo" title="Alterar foto" aria-label="Alterar foto">📷</button></div><div class="social-profile-info"><h2>${e(p.full_name||'Estudante')}</h2><p class="muted">@${e(p.username||'')}</p><p>${e(p.bio||'Estudando para o TJ-SP, um princípio de cada vez.')}</p><div class="social-tags">${badge('TJ-SP 2026/27')}${badge('Aprendizagem ativa')}</div></div></div>
 <div class="social-actions"><button class="button ghost small" data-social-action="choose-photo">Alterar foto</button><button class="button ghost small" data-social-action="edit-profile">${state.edit?'Fechar edição':'Editar perfil'}</button><small class="muted">JPG, PNG ou WebP · máximo 2 MB</small></div><div class="social-avatar-presets"><span class="muted small">Ou escolha um avatar:</span>${avatarIcons.map(icon=>`<button type="button" data-social-action="choose-avatar" data-icon="${e(icon)}" title="Usar avatar ${e(icon)}">${e(icon)}</button>`).join('')}</div>
 ${state.edit?`<form id="social-profile-form" class="social-edit-form"><label>Biografia (até 160 caracteres)<textarea name="bio" maxlength="160" rows="3">${e(p.bio||'')}</textarea></label><label class="social-option"><input type="checkbox" name="discoverable" ${p.discoverable?'checked':''}> Permitir que outros alunos me encontrem</label><label class="social-option"><input type="checkbox" name="allow_requests" ${p.allow_requests?'checked':''}> Receber solicitações de companheiros</label><label class="social-option"><input type="checkbox" name="share_progress" ${p.share_progress?'checked':''}> Compartilhar meu progresso com companheiros aceitos</label><button class="button primary" type="submit">Salvar perfil</button></form>`:''}
 <input type="file" id="social-avatar-input" accept="image/jpeg,image/png,image/webp" hidden></div>
 <div class="social-card"><h3>Minha evolução</h3><div class="social-stats"><div><strong>${s.xp}</strong><small>XP</small></div><div><strong>${s.level}</strong><small>Nível</small></div><div><strong>${s.completed}</strong><small>Desafios praticados</small></div><div><strong>${s.streak}</strong><small>Dias de sequência</small></div></div><h4>Desafios praticados: ${s.completed} de ${s.total}</h4>${bar(s.completed,s.total)}<p class="muted small">O total acompanha o currículo real da Teca. O progresso só é exibido a outros se você permitir.</p><div class="social-actions"><button class="button ghost" data-route="companions">Ver Companheiros</button><button class="button ghost" data-route="chat">Abrir sala de dúvidas</button></div></div>
 </div>`;}
async function loadFriends(withProgress=false){
 const {data,error}=await state.client.from('friendships').select('id,requester_id,addressee_id,status,created_at').order('created_at',{ascending:false});
 if(error){showError(error);return;}state.friends=data||[];
 const ids=[...new Set(state.friends.flatMap(f=>[f.requester_id,f.addressee_id]).filter(v=>v!==id()))];
 if(ids.length){const {data:people,error:perr}=await state.client.from('profiles').select('id,full_name,username,avatar_path,avatar_icon,share_progress').in('id',ids);if(perr)console.warn(perr); for(const p of people||[])state.people.set(p.id,p);await signAvatars(people||[]);}
 await refreshDrawerBadge();
 if(withProgress){const accepted=state.friends.filter(f=>f.status==='accepted');await Promise.all(accepted.map(async f=>{
   const other=f.requester_id===id()?f.addressee_id:f.requester_id;
   if(!state.people.get(other)?.share_progress){state.progress.set(other,null);return;}
   const {data,error}=await state.client.rpc('teca_companion_progress',{target_user:other});
   state.progress.set(other,!error&&Array.isArray(data)&&data.length?data[0]:null);
 }));}
 renderContent();
}
const acceptedFriends=()=>state.friends.filter(f=>f.status==='accepted');
const pendingIncoming=()=>state.friends.filter(f=>f.status==='pending'&&f.addressee_id===id());
const pendingOutgoing=()=>state.friends.filter(f=>f.status==='pending'&&f.requester_id===id());
function otherId(f){return f.requester_id===id()?f.addressee_id:f.requester_id;}
function friendTile(f){const oid=otherId(f),p=person(oid),pr=state.progress.get(oid);let progress='';
 if(pr&&pr.total)progress=`<div class="social-friend-progress"><small>${Number(pr.completed)} de ${Number(pr.total)} desafios</small>${bar(Number(pr.completed),Number(pr.total))}</div>`;
 else progress='<span class="muted small">Progresso privado</span>';
 return `<article class="social-friend">${avatarHTML(p)}<div class="social-friend-info"><strong>${e(p.full_name)}</strong><small class="muted">@${e(p.username)}</small>${progress}</div><div class="social-friend-actions"><button class="button ghost small" data-social-action="open-chat" data-user="${e(oid)}">Mensagem</button><button class="button ghost small" data-social-action="remove-friend" data-id="${e(f.id)}">Desfazer</button></div></article>`;}
function companionsHTML(){const a=acceptedFriends(),incoming=pendingIncoming(),outgoing=pendingOutgoing();return `<div class="social-columns"><div class="social-stack">
 <section class="social-card"><h2>Encontrar companheiros</h2><p class="muted">Busque pelo @usuário. Você decide quem pode ver seu progresso.</p><form id="social-search-form" class="social-search"><input name="user" minlength="3" maxlength="24" placeholder="Buscar @usuário" value="${e(state.searchTerm)}" required><button class="button primary" type="submit">Buscar</button></form>${state.results.length?`<div class="social-search-results">${state.results.map(p=>{const existing=state.friends.find(f=>otherId(f)===p.id);return `<div class="social-result">${avatarHTML(p,'small')}<span><strong>${e(p.full_name)}</strong><small>@${e(p.username)}</small></span>${existing?badge(existing.status==='accepted'?'Companheiros':'Solicitação pendente'):`<button class="button ghost small" data-social-action="request" data-user="${e(p.id)}">Adicionar</button>`}</div>`;}).join('')}</div>`:state.searchTerm?'<p class="muted small">Nenhum perfil disponível com esse usuário.</p>':''}</section>
 <section class="social-card"><div class="social-card-head"><h2>Meus companheiros (${a.length})</h2><button class="button ghost small" data-social-action="refresh-friends">Atualizar</button></div>${a.length?a.map(friendTile).join(''):'<p class="muted">Sua rede começa aqui. Procure um colega pelo nome de usuário e envie um convite.</p>'}</section>
 </div><aside class="social-stack"><section class="social-card"><h2>Solicitações recebidas (${incoming.length})</h2>${incoming.length?incoming.map(f=>{const p=person(f.requester_id);return `<div class="social-pending">${avatarHTML(p,'small')}<div><strong>${e(p.full_name)}</strong><small>@${e(p.username)}</small></div><button class="button primary small" data-social-action="accept" data-id="${e(f.id)}">Aceitar</button><button class="button ghost small" data-social-action="decline" data-id="${e(f.id)}">Recusar</button></div>`;}).join(''):'<p class="muted small">Nenhuma solicitação pendente.</p>'}<h3>Enviadas (${outgoing.length})</h3>${outgoing.length?outgoing.map(f=>{const p=person(f.addressee_id);return `<div class="social-pending">${avatarHTML(p,'small')}<span>${e(p.full_name)}</span><button class="button ghost small" data-social-action="decline" data-id="${e(f.id)}">Cancelar</button></div>`;}).join(''):'<p class="muted small">Nenhuma.</p>'}</section>
 <section class="social-card"><h2>Seu progresso na comunidade</h2><p class="muted">${state.self?.share_progress?'Seus companheiros aceitos podem ver seu total de desafios praticados.':'Seu progresso está privado. Ative o compartilhamento em Meu perfil se desejar.'}</p><button class="button ghost" data-route="profile">Configurar privacidade</button></section></aside></div>`;}
function chatHTML(){const isDirect=Boolean(state.chatPeer),activeName=isDirect?person(state.chatPeer).full_name:rooms.find(r=>r[0]===state.chatRoom)?.[1]||'Geral';return `<div class="social-chat-layout"><aside class="social-card social-chat-sidebar"><h3>Salas de dúvidas</h3>${rooms.map(([key,name])=>`<button class="social-room ${!isDirect&&state.chatRoom===key?'chosen':''}" data-social-action="room" data-room="${key}"># ${name}</button>`).join('')}<h3>Conversas privadas</h3>${acceptedFriends().length?acceptedFriends().map(f=>{const oid=otherId(f),p=person(oid);return `<button class="social-room ${state.chatPeer===oid?'chosen':''}" data-social-action="open-chat" data-user="${e(oid)}">${avatarHTML(p,'small')} ${e(p.full_name)}</button>`;}).join(''):'<p class="muted small">Adicione companheiros para conversar em particular.</p>'}<button class="button ghost small" data-route="companions">Gerenciar companheiros</button></aside>
 <section class="social-card social-chat-box"><div class="social-chat-heading"><div><h2>${isDirect?'Conversa com '+e(activeName):'# '+e(activeName)}</h2><small class="muted">${isDirect?'Somente vocês dois, enquanto forem companheiros.':'Sala coletiva para estudantes aprovados.'}</small></div><button class="button ghost small" data-social-action="refresh-chat">Atualizar</button></div><div class="social-messages" id="social-messages" aria-live="polite">${state.messages.length?state.messages.map(m=>{const p=person(m.sender_id);return `<div class="social-message ${m.sender_id===id()?'mine':''}"><div class="social-message-head"><b>${m.sender_id===id()?'Você':e(p.full_name||'Participante')}</b><small>${e(new Date(m.created_at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))}</small>${m.sender_id!==id()?`<button class="social-report" data-social-action="report" data-id="${Number(m.id)}">Denunciar</button>`:''}</div><p>${e(m.body)}</p></div>`;}).join(''):'<p class="muted">Ainda não há mensagens nesta conversa. Que tal começar com uma dúvida?</p>'}</div>
 <form id="social-chat-form" class="social-compose"><label class="sr-only" for="social-chat-input">Sua mensagem</label><textarea id="social-chat-input" name="body" rows="2" maxlength="1200" placeholder="Escreva sua dúvida ou explicação..." required></textarea><button type="submit" class="button primary" ${state.busy?'disabled':''}>Enviar</button></form><p class="muted small">Seja respeitoso. Não compartilhe senhas nem dados pessoais. Você pode denunciar mensagens inadequadas.</p></section></div>`;}
async function loadChat(){if(!state.ready)return;state.messages=[];renderContent();const target=state.chatPeer;const room=state.chatRoom;
 let query=state.client.from('chat_messages').select('id,sender_id,recipient_id,kind,room,body,created_at').order('created_at',{ascending:false}).limit(70);
 if(target)query=query.eq('kind','direct').or(`sender_id.eq.${target},recipient_id.eq.${target}`);
 else query=query.eq('kind','room').eq('room',room);
 const {data,error}=await query;
 if(target!==state.chatPeer||room!==state.chatRoom)return;
 if(error){showError(error);return;}
 state.messages=(data||[]).slice().reverse();
 const uids=[...new Set(state.messages.map(x=>x.sender_id).filter(x=>x!==id()))];
 const unknown=uids.filter(x=>!state.people.has(x));
 if(unknown.length){const {data:peeps}=await state.client.from('profiles').select('id,full_name,username,avatar_path,avatar_icon').in('id',unknown);for(const p of peeps||[])state.people.set(p.id,p);}
 renderContent();const list=$('#social-messages');if(list)list.scrollTop=list.scrollHeight;startRealtime();}
function stopRealtime(){if(state.channel&&state.client){state.client.removeChannel(state.channel).catch(()=>{});state.channel=null;}}
function startRealtime(){stopRealtime();if(state.page!=='chat'||!state.ready)return;state.channel=state.client.channel('teca-chat-3-7-'+id()).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},payload=>{
 const m=payload.new;
 if(m.kind==='room'&&!state.chatPeer&&m.room===state.chatRoom||m.kind==='direct'&&state.chatPeer&&[m.sender_id,m.recipient_id].includes(state.chatPeer)){
  loadChat().catch(console.warn);
 }
}).subscribe();}
async function refreshDrawerBadge(){const n=pendingIncoming().length;const el=$('#social-drawer-pending');if(el)el.textContent=n?n+' pedidos':'';}
function renderDrawer(){const root=$('#social-drawer-content');if(!root)return;const a=acceptedFriends(),incoming=pendingIncoming();root.innerHTML=(!state.ready?setupHTML():`<p class="muted small">${a.length} companheiro(s) · ${incoming.length} solicitação(ões) recebida(s)</p><div class="social-drawer-list">${a.slice(0,7).map(f=>{const p=person(otherId(f));return `<button data-social-action="open-chat" data-user="${e(p.id)}">${avatarHTML(p,'small')}<span>${e(p.full_name)}</span><span>Conversar →</span></button>`;}).join('')||'<p class="muted">Nenhum companheiro ainda.</p>'}</div><div class="social-drawer-actions"><button class="button primary" data-route="companions">Ver Companheiros</button><button class="button ghost" data-route="chat">Sala de dúvidas</button><button class="button ghost" data-route="profile">Meu perfil</button></div>`);}
function toggleDrawer(open){state.drawer=open===undefined?!state.drawer:open;const overlay=$('#social-drawer-overlay'),drawer=$('#social-drawer');if(!overlay||!drawer)return;overlay.hidden=!state.drawer;drawer.hidden=!state.drawer;$('#social-drawer-toggle')?.setAttribute('aria-expanded',String(state.drawer));if(state.drawer){renderDrawer();loadFriends(false).then(()=>renderDrawer()).catch(console.warn);drawer.querySelector('[data-social-action="close-drawer"]')?.focus();}else $('#social-drawer-toggle')?.focus();}
async function act(action,button){if(!state.ready)return;const fid=button.dataset.id,uid=button.dataset.user;state.error='';state.info='';try{
 if(action==='edit-profile'){state.edit=!state.edit;renderContent();return;}
 if(action==='choose-photo'){$('#social-avatar-input')?.click();return;}
 if(action==='choose-avatar'){
  const icon=button.dataset.icon;if(!avatarIcons.includes(icon))return;
  const old=state.self?.avatar_path;
  const {error}=await state.client.from('profiles').update({avatar_path:null,avatar_icon:icon}).eq('id',id());if(error)throw error;
  if(old)await state.client.storage.from('teca-avatars').remove([old]).catch(()=>{});
  state.self.avatar_path=null;state.self.avatar_icon=icon;state.info='Avatar atualizado.';updateHeader();renderContent();return;
 }
 if(action==='request'){const {error}=await state.client.from('friendships').insert({requester_id:id(),addressee_id:uid,status:'pending'});if(error)throw error;state.info='Convite enviado.';await loadFriends(true);return;}
 if(action==='accept'){const {error}=await state.client.from('friendships').update({status:'accepted'}).eq('id',fid).eq('addressee_id',id());if(error)throw error;state.info='Companheiro adicionado!';await loadFriends(true);return;}
 if(action==='decline'||action==='remove-friend'){if(action==='remove-friend'&&!confirm('Desfazer esta conexão? As conversas privadas deixarão de ficar acessíveis.'))return;const {error}=await state.client.from('friendships').delete().eq('id',fid);if(error)throw error;state.info=action==='decline'?'Solicitação removida.':'Conexão desfeita.';await loadFriends(true);return;}
 if(action==='refresh-friends'){await loadFriends(true);return;}
 if(action==='open-chat'){state.chatPeer=uid;state.messages=[];state.page='chat';state.drawer=false;$('#social-drawer-overlay').hidden=true;$('#social-drawer').hidden=true;window.TECA_ACADEMY_NAVIGATE?.('chat');return;}
 if(action==='room'){state.chatPeer=null;state.chatRoom=button.dataset.room;await loadChat();return;}
 if(action==='refresh-chat'){await loadChat();return;}
 if(action==='report'){const reason=prompt('Por que deseja denunciar esta mensagem? (10 a 500 caracteres)');if(reason===null)return;const body=reason.trim();if(body.length<10||body.length>500){state.error='Explique o motivo em 10 a 500 caracteres.';renderContent();return;}const {error}=await state.client.from('message_reports').insert({reporter_id:id(),message_id:Number(fid),reason:body});if(error)throw error;state.info='Denúncia registrada para revisão da administração.';renderContent();return;}
 if(action==='close-drawer'){toggleDrawer(false);return;}
 }catch(err){showError(err);}}
async function doSearch(term){state.searchTerm=String(term||'').trim().toLowerCase().replace(/[^a-z0-9._-]/g,'').slice(0,24);if(state.searchTerm.length<3){state.error='Digite pelo menos três caracteres do usuário.';renderContent();return;}
 const {data,error}=await state.client.from('profiles').select('id,full_name,username,avatar_path,avatar_icon').eq('approved',true).eq('discoverable',true).ilike('username',`%${state.searchTerm.replace(/[%_]/g,'')}%`).neq('id',id()).limit(15);
 if(error){showError(error);return;}state.results=data||[];for(const p of state.results)state.people.set(p.id,p);await signAvatars(state.results);renderContent();}
async function doProfileSave(form){const fd=new FormData(form);const updates={bio:String(fd.get('bio')||'').trim().slice(0,160),discoverable:fd.has('discoverable'),allow_requests:fd.has('allow_requests'),share_progress:fd.has('share_progress')};
 const {error}=await state.client.from('profiles').update(updates).eq('id',id());if(error){showError(error);return;}
 state.edit=false;state.info='Perfil atualizado.';await loadProfile();}
async function doAvatar(file){if(!file)return;const exts={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};const ext=exts[file.type];if(!ext||file.size>2*1024*1024||file.size<1){state.error='Envie uma imagem JPG, PNG ou WebP de até 2 MB.';renderContent();return;}
 const path=`${id()}/${crypto.randomUUID().replaceAll('-','')}.${ext}`;
 const {error:uploadError}=await state.client.storage.from('teca-avatars').upload(path,file,{contentType:file.type,upsert:false,cacheControl:'300'});if(uploadError){showError(uploadError);return;}
 const old=state.self?.avatar_path;
 const {error}=await state.client.from('profiles').update({avatar_path:path}).eq('id',id());if(error){await state.client.storage.from('teca-avatars').remove([path]);showError(error);return;}
 state.self.avatar_path=path;if(old)await state.client.storage.from('teca-avatars').remove([old]).catch(()=>{});await signAvatars([state.self]);updateHeader();state.info='Foto atualizada.';renderContent();}
async function doChatSend(form){if(state.busy)return;const body=String(new FormData(form).get('body')||'').trim();if(!body||body.length>1200)return;
 state.busy=true;
 const payload=state.chatPeer?{sender_id:id(),kind:'direct',recipient_id:state.chatPeer,body}:{sender_id:id(),kind:'room',room:state.chatRoom,body};
 const {error}=await state.client.from('chat_messages').insert(payload);
 state.busy=false;
 if(error){showError(error);return;}
 await loadChat();}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-social-action]');if(btn){event.preventDefault();act(btn.dataset.socialAction,btn);return;}
 const menu=event.target.closest('#social-drawer-toggle');if(menu){toggleDrawer();return;}
 const back=event.target.closest('#social-drawer-overlay');if(back){toggleDrawer(false);return;}
 if(state.drawer&&event.target.closest('#social-drawer [data-route]'))toggleDrawer(false);
});
document.addEventListener('submit',event=>{
 if(event.target.id==='social-profile-form'){event.preventDefault();doProfileSave(event.target);}
 if(event.target.id==='social-search-form'){event.preventDefault();doSearch(new FormData(event.target).get('user'));}
 if(event.target.id==='social-chat-form'){event.preventDefault();doChatSend(event.target);}
});
document.addEventListener('change',event=>{if(event.target.id==='social-avatar-input'){doAvatar(event.target.files?.[0]);}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.drawer)toggleDrawer(false);});
window.TECA_SOCIAL={init,renderPage,mount,updateHeader,stopRealtime,refreshDrawerBadge};
})();
