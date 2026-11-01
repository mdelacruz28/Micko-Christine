/* Smooth original-image ink reveal. SVG masks retain the supplied gold pixels. */

 const states=new WeakMap();let sequence=0;
 const animationScale = 4000 / 7100;
 export function mountWeddingIntro(host){
  if(states.has(host))return states.get(host).controller;
  const original=host.querySelector('img');if(!original)return;
  const state={animations:[],done:false,motion:matchMedia('(prefers-reduced-motion: reduce)')};
  states.set(host,state);
  const id='smooth-'+(++sequence);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox',host.dataset.introViewbox || '0 0 1536 1024');svg.setAttribute('aria-hidden','true');
  const strokes=[];
  const add=(delay,duration,width,d,clip='')=>strokes.push({delay,duration,width,d,clip});
  // Separate rings: steady pen velocity instead of stopping at each new subpath.
  add(0,1900,7,'M480 406 C516 282 636 197 767 197 C901 197 1023 282 1058 406');
  add(120,1900,5,'M486 407 C523 286 638 204 767 204 C898 204 1015 285 1052 407');
  add(1850,280,15,'M480 405 L480 407');add(1970,280,15,'M1058 405 L1058 407');
  add(2800,1450,6,'M521 654 C562 711 615 748 685 768');
  add(2920,1450,5,'M527 652 C568 706 621 743 686 761');
  add(2950,1450,6,'M1015 654 C974 711 921 748 851 768');
  add(3070,1450,5,'M1009 652 C968 706 915 743 850 761');
  // Calligraphic M: flourish, stem, diagonals, then descending terminal.
  add(260,1050,28,'M592 346 C624 340 650 359 658 391','m');
  add(1100,1050,29,'M651 385 L638 511 Q638 538 610 538','m');
  add(1940,210,12,'M606 537 L653 537','m');
  add(1250,1250,29,'M657 390 L724 525 L796 373 L806 462','m');
  add(2430,1000,27,'M814 490 C813 547 833 583 890 584','tail');
  // C travels continuously from the upper terminal, anticlockwise around the bowl.
  add(2380,2100,29,'M938 498 L933 477 C889 452 841 459 805 487 C766 516 754 565 778 607 C801 650 855 659 902 643 C940 629 956 590 959 556','c');
  // Stems first, individual branch strokes and leaves follow their growth direction.
  const stem='M590 685 C557 666 528 635 507 599 C480 555 469 507 474 447';
  add(950,2400,12,stem);add(1120,2400,12,stem,'mirror');
  const branches=[
   [1700,'M475 492 Q470 482 451 479'],[1800,'M477 517 Q493 509 516 500'],
   [2000,'M485 548 Q475 535 450 526'],[2200,'M500 580 Q485 572 461 553'],
   [2400,'M510 603 Q529 586 530 558'],[2590,'M525 625 Q500 613 473 605'],
   [2730,'M542 649 Q540 625 543 606'],[2900,'M554 662 Q536 642 501 642']
  ];
  branches.forEach(([t,d])=>{add(t,550,9,d);add(t+170,550,9,d,'mirror');});
  const leaves=[
   [1450,19,'M474 469 Q467 450 474 434'],
   [1520,21,'M483 455 Q503 438 516 426'],
   [1720,18,'M481 480 Q496 470 505 460'],
   [1950,19,'M487 518 Q498 499 495 484'],
   [2210,17,'M480 545 Q465 534 456 522'],
   [2390,19,'M485 567 Q465 560 455 548'],
   [2570,19,'M516 601 Q532 581 531 555'],
   [2780,16,'M498 604 Q478 595 465 585'],
   [2960,19,'M521 642 Q502 637 489 640'],
   [3150,16,'M546 652 Q535 642 529 631']
  ];
  leaves.forEach(([t,w,d])=>{add(t,480,w,d);add(t+170,480,w,d,'mirror');});
  const berries=[[451,478],[460,470],[454,490],[518,500],[510,508],[521,512],[446,505],[455,514],[544,605],[534,601],[549,612],[475,593],[482,601],[590,685]];
  berries.forEach(([x,y],i)=>{add(1850+i*115,220,9,'M'+x+' '+y+' l.1 .1');add(2020+i*115,220,9,'M'+x+' '+y+' l.1 .1','mirror');});
  // Names/date are a continuous handwriting sweep along the original curved text.
  add(3850,1700,54,'M525 382 C612 185 924 185 1011 382','names');
  add(5170,1250,46,'M630 704 Q768 769 910 701','date');
  add(5550,700,5,'M687 758 Q722 784 749 776 Q768 777 768 803');
  add(5650,700,5,'M849 758 Q814 784 787 776 Q768 777 768 803');
  [[687,756,714,770],[708,754,733,768],[724,767,746,774],[848,756,821,770],[827,754,802,768],[811,767,789,774]].forEach(([x,y,a,b],i)=>add(5680+i*75,330,13,'M'+x+' '+y+' Q'+((x+a)/2)+' '+y+' '+a+' '+b));
  add(6050,300,8,'M748 782 l.1 .1');add(6120,300,8,'M787 782 l.1 .1');
  const clipDefs='<clipPath id="'+id+'-m"><path d="M587 335H684L736 466L810 346L823 470L792 483L790 409L726 550L666 421L660 550H591Z"/></clipPath>'+
   '<clipPath id="'+id+'-tail"><path d="M799 480L824 485Q818 558 902 586L902 597Q810 597 799 516Z"/></clipPath>'+
   '<clipPath id="'+id+'-c"><path d="M744 450H973V669H744Z"/></clipPath>'+
   '<clipPath id="'+id+'-names"><path d="M490 410L510 310L660 210H870L1026 310L1046 410L989 420L943 329L859 277L765 267L669 281L592 334L547 419Z"/></clipPath>'+
   '<clipPath id="'+id+'-date"><path d="M613 679H922V751H613Z"/></clipPath>';
  svg.innerHTML='<defs>'+clipDefs+
   '<clipPath id="'+id+'-center"><ellipse cx="768" cy="498" rx="350" ry="318"/></clipPath>'+
   '<radialGradient id="'+id+'-paper"><stop stop-color="#fff7e5"/><stop offset="1" stop-color="#f9edda"/></radialGradient>'+
   // Only cover the actual ink silhouettes. Original paper remains visible between strokes.
   '<filter id="'+id+'-ink" x="0" y="0" width="1536" height="1024" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">'+
   '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 -16 0 11.6"/><feMorphology operator="dilate" radius="1.25"/><feGaussianBlur stdDeviation=".45"/></filter>'+
   '<mask id="'+id+'-outside" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/><g clip-path="url(#'+id+'-center)"><image class="ink-map" width="1536" height="1024" filter="url(#'+id+'-ink)"/></g></mask>'+
   '<mask id="'+id+'-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024">'+
   strokes.map(s=>'<g'+(s.clip==='mirror'?' transform="translate(1536 0) scale(-1 1)"':s.clip?' clip-path="url(#'+id+'-'+s.clip+')"':'')+'><path d="'+s.d+'" fill="none" stroke="white" stroke-width="'+s.width+'" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-delay="'+Math.round(s.delay*animationScale)+'" data-duration="'+Math.round(s.duration*animationScale)+'"/></g>').join('')+
   '</mask></defs><rect width="1536" height="1024" fill="url(#'+id+'-paper)"/>'+
   '<image width="1536" height="1024" mask="url(#'+id+'-outside)"/>'+
   '<image width="1536" height="1024" mask="url(#'+id+'-reveal)"/>'+
   '<image class="final-art" width="1536" height="1024" opacity="0"/>';
  svg.querySelectorAll('image').forEach(i=>i.setAttribute('href',original.getAttribute('src')));
  function finish(){
   if(state.done||state.disposed)return;state.done=true;state.animations.forEach(a=>a.cancel());svg.remove();
   state.motion.removeEventListener('change',onMotion);host.dataset.complete='true';
   host.dispatchEvent(new CustomEvent('intro-complete',{bubbles:true}));
  }
  function onMotion(){if(state.motion.matches)finish();}
  state.finish=finish;
  state.controller={finish,destroy(){state.disposed=true;state.animations.forEach(a=>a.cancel());svg.remove();state.motion.removeEventListener('change',onMotion);}};
  if(state.motion.matches||!Element.prototype.animate){finish();return state.controller;}
  host.append(svg);state.motion.addEventListener('change',onMotion);
  (original.decode?original.decode():Promise.resolve()).then(()=>{
   if(state.done||state.disposed||!host.isConnected){finish();return state.controller;}
   svg.querySelectorAll('[data-delay]').forEach(p=>{
    state.animations.push(p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{
     duration:Number(p.dataset.duration),delay:Number(p.dataset.delay),easing:'linear',fill:'forwards',iterations:1
    }));
   });
   const final=svg.querySelector('.final-art').animate([{opacity:0},{opacity:1}],{delay:Math.round(6450*animationScale),duration:4000-Math.round(6450*animationScale),fill:'forwards',iterations:1});
   state.animations.push(final);final.finished.then(finish).catch(()=>{});
  }).catch(finish);
  return state.controller;
 }
