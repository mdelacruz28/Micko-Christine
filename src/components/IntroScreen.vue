<template>
  <section class="intro">
    <!-- Background -->
    <div class="background"></div>
    <div class="overlay"></div>

    <!-- Content -->
    <div class="content">

      <div class="monogram">
  <img
    src="/images/intro/Monogram.png"
    alt="M & C Monogram"
  />
</div>

      <p class="welcome">
        Your presence will make our celebration complete
      </p>
      
      <h1>
        
      </h1>
      
      <div class="divider"></div>

      <!-- <p class="date">
        January 17, 2027
      </p>

      <p class="venue">
        Bell Amphitheater • Camp John Hay
      </p> -->

      <button class="open-btn" @click="$emit('open')">Open Invitation</button>

    </div>

    <!-- <div class="scroll-indicator">
      <span></span>
    </div> -->

  </section>
</template>

<script setup>
</script>

<style scoped>

.intro{
    position:relative;
    height:100vh;
    overflow:hidden;
    display:flex;
    justify-content:center;
    align-items:center;
    text-align:center;
    color:white;
}

/* ===========================
Background Photo
=========================== */

.background{

    position:absolute;
    inset:0;

    background-image:url("/images/intro/intro_bg.png");
    background-size:cover;
    background-position:center;

    animation:zoomBackground 25s ease-in-out infinite alternate;

}

/* ===========================
Overlay
=========================== */

.overlay{

    position:absolute;
    inset:0;

    background:
        linear-gradient(
            rgba(15,23,42,.30),
            rgba(15,23,42,.55)
        );

    backdrop-filter:blur(2px);

}

/* ===========================
Content
=========================== */

.content{

    position:relative;
    z-index:5;
    width:min(90%,850px);
    padding:55px 45px;
    /* border:1px solid rgba(255,255,255,.30); */
    /* background:rgba(255,255,255,.08); */
    /* backdrop-filter:blur(14px); */
    /* border-radius:28px; */
    animation:fadeUp 1.2s ease;
    /* box-shadow: 0 25px 70px rgba(0,0,0,.25); */

}

.monogram{

    display:flex;
    justify-content:center;
    align-items:center;
    margin-bottom:28px;

}
.monogram img{

    width:300px;
    max-width:70vw;
    height:auto;
    object-fit:contain;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,.35));
    animation:
        fadeIn 1.5s ease,
        floatMonogram 6s ease-in-out infinite;
}

.monogram span{

    color:#F8B79A;

}

.welcome{

    letter-spacing:4px;
    text-transform:uppercase;
    font-size:.9rem;

    opacity:.9;

}

h1{

    margin-top:20px;
    margin-bottom:15px;

    font-size:4rem;
    line-height:1.1;

    font-family:"Cormorant Garamond",serif;
    font-weight:500;

}

h1 span{

    color:#F8B79A;

}

.divider{

    width:90px;
    height:1px;
    background:white;

    margin:30px auto;

}

.date{

    font-size:1.1rem;
    letter-spacing:3px;
    margin-bottom:8px;

}

.venue{

    opacity:.85;
    margin-bottom:40px;

}

.open-btn{

    border:1px solid rgba(255, 255, 255, .30);

    padding:16px 45px;

    border-radius:50px;

    background:transparent;

    color:rgb(255, 254, 254);

    font-size:.95rem;

    letter-spacing:2px;

    cursor:pointer;

    transition:.35s;

}

.open-btn:hover{

    transform:translateY(-4px);

    background:#050505;
    
    opacity: 70%;
}

/* ===========================
Scroll
=========================== */

.scroll-indicator{

    position:absolute;

    bottom:35px;
    left:50%;

    transform:translateX(-50%);
    z-index:5;

}

.scroll-indicator span{

    width:2px;
    height:45px;

    display:block;

    background:white;

    opacity:.7;

    animation:scroll 2s infinite;

}

/* ===========================
Animations
=========================== */

@keyframes zoomBackground{

    from{

        transform:scale(1);

    }

    to{

        transform:scale(1.1);

    }

}

@keyframes fadeUp{

    from{

        opacity:0;
        transform:translateY(35px);

    }

    to{

        opacity:1;
        transform:translateY(0);

    }

}

@keyframes scroll{

    0%{

        transform:translateY(0);
        opacity:0;

    }

    50%{

        opacity:1;

    }

    100%{

        transform:translateY(18px);
        opacity:0;

    }

}

/* ===========================
Responsive
=========================== */

@media(max-width:768px){

.content{

    padding:40px 28px;

}

.monogram{

    font-size:3rem;

}

.monogram img{

        width:140px;

    }

h1{

    font-size:2.6rem;

}

.date{

    font-size:.95rem;

}

}

</style>