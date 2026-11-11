/* Teca Academia 3.3 — autenticação por usuário, sem pedir e-mail. */
'use strict';
const CFG=window.TECA_CONFIG||{};
const configured=/^https:\/\/[^\s]+\.supabase\.co\/?$/.test(CFG.supabaseUrl||'') && /^sb_publishable_/.test(CFG.publishableKey||'');
const root=document.documentElement, publicShell=document.getElementById('public-shell');
const publicContent=document.getElementById('public-content');
const academyShell=document.getElementById('academy-shell');
const academyMobile=document.getElementById('academy-mobile');
const suggestionForm=document.getElementById('suggestion-form');
let supabase=null,account=null,active=false,saveTimer=null,savePending=null,currentPublic='welcome';
const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const normalizeUsername=(u)=>String(u||'').trim().toLowerCase();
// Endereço técnico fictício, gerado sem coletar o endereço pessoal do estudante.
const usernameAddress=(u)=>`${normalizeUsername(u)}@accounts.teca.example.com`;
const applyTheme=(theme)=>{
  const t=theme==='dark'?'dark':'light';root.dataset.theme=t;
  localStorage.setItem('teca_color_scheme',t);
  document.querySelectorAll('[data-theme-toggle]').forEach(el=>el.textContent=t==='dark'?'Modo claro':'Modo escuro');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',t==='dark'?'#24343d':'#344752');
};
applyTheme(localStorage.getItem('teca_color_scheme')||'light');
document.addEventListener('click',(e)=>{
 const theme=e.target.closest('[data-theme-toggle]');if(theme){applyTheme(root.dataset.theme==='dark'?'light':'dark');return;}
 const nav=e.target.closest('[data-public]');if(nav){showPublic(nav.dataset.public);return;}
});
document.getElementById('brand-home').addEventListener('click',e=>{e.preventDefault();showPublic('welcome')});
const mainLink='<a target="_blank" rel="noreferrer" href="https://www.vunesp.com.br/TJSP2607">Página oficial do concurso</a>';
const intro=`<div class="welcome-grid"><section class="intro-box"><div class="eyebrow">Bem-vindo à Teca Academia</div><h1>Um jeito mais claro de estudar para concursos.</h1><p>Estude em pequenas etapas, entenda o motivo das respostas e acompanhe sua evolução, sozinho ou com amigos.</p><div class="intro-actions"><button type="button" class="solid-btn" data-public="register">Pedir acesso</button><button type="button" class="subtle-btn" data-public="login">Já tenho cadastro</button><button type="button" class="subtle-btn" data-public="about">Como funciona</button></div></section><aside class="welcome-panel"><div class="eyebrow">Sua rotina, com direção</div><h2>O que você encontra aqui</h2><div class="feature-step"><span class="feature-no">01</span><div><strong>Trilhas por matéria</strong><small>Primeiro você tenta, depois confere a explicação.</small></div></div><div class="feature-step"><span class="feature-no">02</span><div><strong>Missões do dia</strong><small>Atividades curtas que alternam diferentes assuntos.</small></div></div><div class="feature-step"><span class="feature-no">03</span><div><strong>Revisão e progresso</strong><small>XP por exercícios e explicações, sem cobrança exagerada.</small></div></div><div class="feature-step"><span class="feature-no">04</span><div><strong>Datas do edital</strong><small>Prazo de inscrição, prova, gabarito e etapas futuras.</small></div></div></aside></div><div class="banner-lite">A Teca é um projeto independente de estudos entre amigos. Consulte sempre os comunicados oficiais da Vunesp: ${mainLink}.</div>`;
function showPublic(which='welcome',msg=''){
 currentPublic=which;publicShell.hidden=false;academyShell.hidden=true;academyMobile.hidden=true;
 document.getElementById('suggestion-text').disabled=true;suggestionForm.querySelector('button').disabled=true;
 if(which==='welcome')publicContent.innerHTML=intro;
 if(which==='about')publicContent.innerHTML=`<article class="article-card"><div class="eyebrow">Comece por aqui</div><h1>Como funciona a Teca</h1><p>Você não precisa conhecer nenhum método de estudo. O objetivo é simples: aprender a resolver questões entendendo o princípio por trás de cada resposta.</p><section><h3>1. Crie seu cadastro</h3><p>Informe seu nome completo, um nome de usuário e uma senha. O acesso será liberado manualmente pelo criador da academia.</p></section><section><h3>2. Escolha sua primeira missão</h3><p>Faça o desafio antes da teoria. Depois leia a explicação, justifique a escolha e tente aplicar a regra em um caso diferente.</p></section><section><h3>3. Pratique aos poucos</h3><p>As missões misturam matérias e ajudam a revisar aquilo que merece atenção. Estudar em dias diferentes conta mais do que decorar um gabarito.</p></section><section><h3>4. Acompanhe edital e resultados</h3><p>O calendário apresenta as datas oficiais e informa quando horários ou etapas ainda não foram publicados.</p></section><p class="muted-note">Este é um espaço independente, sem vínculo com o TJ-SP ou a Vunesp. ${mainLink}.</p><div class="intro-actions"><button class="solid-btn" type="button" data-public="register">Solicitar acesso</button><button class="subtle-btn" type="button" data-public="welcome">Voltar ao início</button></div></article>`;
 if(which==='login')publicContent.innerHTML=`<section class="auth-card"><div class="eyebrow">Área do estudante</div><h1>Entrar</h1><p>Use o nome de usuário e a senha que você escolheu no cadastro.</p><form id="login-form"><label for="login-username">Nome de usuário</label><input id="login-username" name="username" minlength="3" maxlength="24" required autocomplete="username" autocapitalize="none" spellcheck="false"><label for="login-password">Senha</label><input id="login-password" name="password" type="password" required autocomplete="current-password"><button class="solid-btn" type="submit">Entrar na academia</button></form><div class="status-msg" role="status" id="auth-status">${esc(msg)}</div><p class="muted-note">Ainda não tem conta? <a href="#cadastro" data-public="register">Peça acesso aqui.</a></p></section>`;
 if(which==='register')publicContent.innerHTML=`<section class="auth-card"><div class="eyebrow">Cadastro entre amigos</div><h1>Criar uma conta</h1><p>Você só precisa preencher estes três campos. Depois, seu cadastro aguarda aprovação.</p><form id="register-form"><label for="full-name">Nome completo</label><input id="full-name" name="fullName" minlength="5" maxlength="90" required autocomplete="name"><label for="username">Nome de usuário</label><input id="username" name="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9._-]{3,24}" title="Use de 3 a 24 letras, números, pontos, hífens ou sublinhados" required autocomplete="username" autocapitalize="none" spellcheck="false"><label for="password">Senha (mínimo de 8 caracteres)</label><input id="password" name="password" type="password" minlength="8" required autocomplete="new-password"><button class="solid-btn" type="submit">Enviar pedido de acesso</button></form><div class="status-msg" role="status" id="auth-status">${esc(msg)}</div><p class="muted-note">Não solicitamos e-mail. Para entrar após aprovação, guarde seu usuário e sua senha.</p><p class="muted-note">Já tem cadastro? <a href="#entrar" data-public="login">Entrar</a></p></section>`;
 if(which==='pending')publicContent.innerHTML=`<section class="auth-card"><div class="eyebrow">Seu pedido foi recebido</div><h1>Cadastro aguardando aprovação</h1><div class="pending-banner">Seu nome foi registrado. Assim que o administrador aprovar, você poderá entrar com seu usuário e senha.</div><p class="muted-note">A aprovação é feita manualmente; não enviamos e-mails de confirmação.</p><button class="solid-btn" type="button" id="pending-recheck">Verificar aprovação</button> <button class="subtle-btn" type="button" id="pending-logout">Sair</button><div class="status-msg" id="auth-status">${esc(msg)}</div></section>`;
 if(!configured){publicContent.insertAdjacentHTML('beforeend',`<div class="banner-lite"><b>Configuração pendente:</b> o administrador deve preencher <code>config.js</code> e instalar o banco e a função de cadastro no Supabase. <a href="GUIA-INSTALACAO.md">Ver instruções</a>.</div>`)}
 publicContent.focus();
}
function showMsg(msg,isError=false){const el=document.getElementById('auth-status');if(el){el.textContent=msg;el.classList.toggle('error',isError)}}
async function getClient(){if(supabase)return supabase;if(!configured)throw Error('Supabase ainda não configurado. Abra o guia de instalação.');const mod=await import('https://esm.sh/@supabase/supabase-js@2.57.0?bundle');supabase=mod.createClient(CFG.supabaseUrl,CFG.publishableKey,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}});return supabase;}
async function profileFor(user){const {data,error}=await supabase.from('profiles').select('id,full_name,username,approved').eq('id',user.id).single();if(error)throw error;return data;}
async function checkSession(){if(!configured){showPublic('welcome');return;}try{await getClient();const {data:{user},error}=await supabase.auth.getUser();if(error||!user){showPublic('welcome');return;}account=await profileFor(user);if(!account.approved){showPublic('pending');return;}await startAcademy(user,account);}catch(err){console.error(err);showPublic('login','Não foi possível verificar sua sessão. Tente entrar novamente.');}}
async function startAcademy(user,profile){if(active)return;active=true;publicShell.hidden=true;academyShell.hidden=false;academyMobile.hidden=false;window.TECA_USER_ID=user.id;window.TECA_ON_SAVE=queueSave;
 document.getElementById('suggestion-text').disabled=false;suggestionForm.querySelector('button').disabled=false;
 const id=`teca_academia_v3_tjsp2607_${user.id}`;
 try{const {data,error}=await supabase.from('study_state').select('payload').eq('user_id',user.id).maybeSingle();if(error)throw error;if(data?.payload) localStorage.setItem(id,JSON.stringify(data.payload));}catch(err){console.warn('Não foi possível sincronizar o progresso remoto',err);}
 const {data:curriculum,error:contentError}=await supabase.from('curriculum').select('lessons,events,undated,meta').eq('id','tjsp2607').single();
 if(contentError||!curriculum?.lessons?.length){active=false;showPublic('login','Os conteúdos ainda não foram configurados no Supabase. Avise o administrador.');return;}
 window.TECA_LESSONS=curriculum.lessons;window.TECA_EVENTS=curriculum.events;window.TECA_UNDATED=curriculum.undated;window.TECA_META=curriculum.meta;
 document.querySelector('.topbar .top-info').textContent=`Olá, ${profile.full_name.split(' ')[0]} · TJSP2607 · Versão 3.3`;
 await new Promise((resolve,reject)=>{let script=document.createElement('script');script.src='academy.js';script.onload=resolve;script.onerror=reject;document.body.append(script)});
}
function queueSave(state){if(!active||!supabase||!account?.approved)return;savePending=state;clearTimeout(saveTimer);saveTimer=setTimeout(flushSave,1100)}
async function flushSave(){if(!active||!savePending)return;const payload=savePending;savePending=null;const {error}=await supabase.from('study_state').upsert({user_id:account.id,payload,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error){savePending=payload;console.warn('A sincronização falhou; dados locais permanecem salvos:',error.message)}}
async function signOut(){if(savePending)await flushSave();if(supabase)await supabase.auth.signOut();window.location.reload();}
document.addEventListener('submit',async e=>{
 if(e.target.id==='register-form'){
  e.preventDefault();let fd=new FormData(e.target);const fullName=String(fd.get('fullName')||'').trim(),username=normalizeUsername(fd.get('username')),password=String(fd.get('password')||'');
  if(fullName.length<5||! /^[a-z0-9._-]{3,24}$/.test(username)||password.length<8){showMsg('Confira o nome, usuário e a senha com pelo menos 8 caracteres.',true);return;}
  const btn=e.target.querySelector('button[type=submit]');btn.disabled=true;showMsg('Enviando pedido...');try{await getClient();const {data,error}=await supabase.functions.invoke('request-access',{body:{fullName,username,password}});if(error||!data?.ok)throw Error(data?.error||'Não foi possível concluir o cadastro.');showPublic('pending','Seu pedido foi enviado. Aguarde liberação.');}catch(err){showMsg(err.message||'Erro de cadastro',true);}finally{btn.disabled=false;}return;
 }
 if(e.target.id==='login-form'){
  e.preventDefault();let fd=new FormData(e.target);const username=normalizeUsername(fd.get('username')),password=String(fd.get('password')||'');
  if(!/^[a-z0-9._-]{3,24}$/.test(username)){showMsg('Confira seu nome de usuário.',true);return;}
  const btn=e.target.querySelector('button[type=submit]');btn.disabled=true;showMsg('Conferindo acesso...');try{await getClient();const {data,error}=await supabase.auth.signInWithPassword({email:usernameAddress(username),password});if(error||!data.user)throw Error('Usuário ou senha incorretos.');account=await profileFor(data.user);if(!account.approved){showPublic('pending');return;}await startAcademy(data.user,account);}catch(err){showMsg(err.message||'Não foi possível entrar.',true);}finally{btn.disabled=false;}return;
 }
 if(e.target.id==='suggestion-form'){
  e.preventDefault();const field=e.target.querySelector('textarea');const msg=field.value.trim();const status=document.getElementById('suggestion-status');if(!active||!account?.approved){status.textContent='Entre em sua conta aprovada para enviar sugestões.';return;}if(msg.length<10){status.textContent='Escreva pelo menos 10 caracteres.';return;}
  const {error}=await supabase.from('suggestions').insert({user_id:account.id,body:msg});status.textContent=error?'Não foi possível enviar. Tente novamente.':'Sugestão registrada. Obrigado!';if(!error)field.value='';return;
 }
});
document.addEventListener('click',async e=>{if(e.target.closest('#pending-logout')||e.target.closest('#logout-btn')){await signOut();return;}if(e.target.closest('#pending-recheck')){try{const {data:{user}}=await supabase.auth.getUser();if(!user){showPublic('login');return;}account=await profileFor(user);if(account.approved)await startAcademy(user,account);else showMsg('Seu cadastro continua aguardando aprovação.');}catch{showMsg('Entre novamente para verificar seu acesso.',true);}return;}});
showPublic('welcome');checkSession();

if('serviceWorker' in navigator && location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
