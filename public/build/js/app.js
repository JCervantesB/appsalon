let paso=1,pasoInicial=1,pasoFinal=3;const cita={id:"",nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaSiguiente(),paginaAnterior(),consultarAPI(),idCliente(),nombreCliente(),seleccionarFecha(),seleccionarHora(),mostrarResumen()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");const t="#paso-"+paso;document.querySelector(t).classList.add("mostrar");const o=document.querySelector(".actual");o&&o.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",(function(e){paso=parseInt(e.target.dataset.paso),mostrarSeccion(),botonesPaginador()}))})}function botonesPaginador(){const e=document.querySelector("#anterior"),t=document.querySelector("#siguiente");1===paso?(e.classList.add("ocultar"),t.classList.remove("ocultar")):3===paso?(e.classList.remove("ocultar"),t.classList.add("ocultar"),mostrarResumen()):(e.classList.remove("ocultar"),t.classList.remove("ocultar")),mostrarSeccion()}function paginaAnterior(){document.querySelector("#anterior").addEventListener("click",(function(){paso<=pasoInicial||(paso--,botonesPaginador())}))}function paginaSiguiente(){document.querySelector("#siguiente").addEventListener("click",(function(){paso>=pasoFinal||(paso++,botonesPaginador())}))}async function consultarAPI(){try{const e=location.origin+"/api/servicios",t=await fetch(e);mostrarServicios(await t.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach(e=>{const{id:t,nombre:o,precio:n}=e,a=document.createElement("P");a.classList.add("nombre-servicio"),a.textContent=o;const c=document.createElement("P");c.classList.add("precio-servicio"),c.textContent="$ "+n;const r=document.createElement("DIV");r.classList.add("servicio"),r.dataset.idServicio=t,r.onclick=function(){seleccionarServicio(e)},r.appendChild(a),r.appendChild(c),document.querySelector("#servicios").appendChild(r)})}function seleccionarServicio(e){const{id:t}=e,{servicios:o}=cita,n=document.querySelector(`[data-id-servicio="${t}"]`);o.some(e=>e.id===t)?(cita.servicios=o.filter(e=>e.id!==t),n.classList.remove("seleccionado")):(cita.servicios=[...o,e],n.classList.add("seleccionado"))}function idCliente(){cita.id=document.querySelector("#id").value}function nombreCliente(){const e=document.querySelector("#nombre").value;cita.nombre=e}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value),o=t.getUTCDay(),n=new Date;t.toDateString()===n.toDateString()?cita.fecha=e.target.value:[6,0].includes(o)?(e.target.value="",mostrarAlerta("Fines de semana no permitidos","error",".formulario")):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){const t=e.target.value.split(":")[0];t<(new Date).getHours()||t<10||t>18?(e.target.value="",mostrarAlerta("Hora no válida","error",".formulario")):cita.hora=e.target.value})),opcionesHora.forEach((function(e){const t=e.value.split(":")[0];(t<(new Date).getHours()||t<10||t>18)&&(e.disabled=!0)}))}function mostrarAlerta(e,t,o,n=!0){const a=document.querySelector(".alerta");a&&a.remove();const c=document.createElement("DIV");c.textContent=e,c.classList.add("alerta"),c.classList.add(t);document.querySelector(o).appendChild(c),n&&setTimeout(()=>{c.remove()},3e3)}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Falta Datos de Servicios, Fecha u Hora","error",".contenido-resumen",!1);const{nombre:t,fecha:o,hora:n,servicios:a}=cita,c=document.createElement("H3");c.textContent="Resumen Servicios",e.appendChild(c),a.forEach(t=>{const{id:o,precio:n,nombre:a}=t,c=document.createElement("DIV");c.classList.add("contenedor-servicio");const r=document.createElement("P");r.textContent=a;const i=document.createElement("P");i.innerHTML="<span>Precio:</span> $"+n,c.appendChild(r),c.appendChild(i),e.appendChild(c)});const r=a.reduce((e,t)=>e+parseFloat(t.precio),0),i=document.createElement("P");i.innerHTML="<span>Total:</span> $"+r;const s=document.createElement("P");s.innerHTML="<span>Nombre:</span> "+t;const d=new Date(o),l=d.getMonth(),u=d.getDate()+2,m=d.getFullYear(),p=new Date(Date.UTC(m,l,u)).toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),v=document.createElement("P");v.innerHTML="<span>Fecha:</span> "+p;const f=document.createElement("P");f.innerHTML=`<span>Hora:</span> ${n} Horas`;const h=document.createElement("P");h.innerHTML="<span>Cantidad de Servicios:</span> "+a.length;const g=document.createElement("BUTTON");g.classList.add("boton"),g.textContent="Reservar Cita",g.onclick=reservarCita,e.appendChild(s),e.appendChild(v),e.appendChild(f),e.appendChild(h),e.appendChild(i),e.appendChild(g)}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));const Toast=Swal.mixin({toast:!0,position:"top-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0,didOpen:e=>{e.addEventListener("mouseenter",Swal.stopTimer),e.addEventListener("mouseleave",Swal.resumeTimer)}});async function reservarCita(){const{id:e,fecha:t,hora:o,servicios:n}=cita,a=n.map(e=>e.id),c=new FormData;c.append("usuarioId",e),c.append("fecha",t),c.append("hora",o),c.append("servicios",a),console.log(c);try{const e=location.origin+"/api/citas",t=await fetch(e,{method:"POST",body:c}),o=await t.json();console.log(o),exito()}catch(e){Toast.fire({icon:"error",title:"Oops! Ocurrio un error al guardar la cita."})}}function exito(){Toast.fire({icon:"success",title:"La cita fue creada correctamente."}).then(()=>{window.location.reload()})}