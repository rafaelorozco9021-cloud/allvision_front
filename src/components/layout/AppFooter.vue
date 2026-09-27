<template>
  <footer class="site-footer">
    <div class="site-footer__main">
      <div class="site-footer__brand">
        <span class="site-footer__logo">AllVision</span>
        <p class="site-footer__blurb">
          Periódico digital con lo más relevante de la actualidad nacional e internacional, en tiempo real.
        </p>
        <SocialLinks large />
      </div>

      <div class="site-footer__col">
        <h4 class="site-footer__title">Secciones</h4>
        <ul class="site-footer__list">
          <li v-for="s in sections" :key="s"><router-link to="/feed">{{ s }}</router-link></li>
        </ul>
      </div>

      <div class="site-footer__col">
        <h4 class="site-footer__title">Explora</h4>
        <ul class="site-footer__list">
          <li><router-link to="/">Portada</router-link></li>
          <li><router-link to="/feed">Últimas noticias</router-link></li>
          <li><router-link to="/trending">Lo más leído</router-link></li>
          <li><a href="#newsletter">Boletín informativo</a></li>
        </ul>
      </div>

      <div class="site-footer__col">
        <h4 class="site-footer__title">Legales</h4>
        <ul class="site-footer__list">
          <li v-for="l in legales" :key="l.id">
            <router-link :to="{ path: '/legal', hash: '#' + l.id }">{{ l.label }}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>rodev9021 - todos los derechos reservados</p>
      <p class="site-footer__addr">calle44 #5b-116 apto 2</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialLinks from '@/components/common/SocialLinks.vue';

const sections = ['Generales', 'Mundo', 'Política', 'Sociales', 'Deportes', 'Tecnología', 'Judiciales', 'Opinión'];
const legales = [
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'imagenes', label: 'Fotografías' },
  { id: 'ia', label: 'Titulares con IA' },
  { id: 'terminos', label: 'Términos y condiciones' },
  { id: 'privacidad', label: 'Política de privacidad' },
  { id: 'contacto', label: 'Contacto' },
];
</script>

<style scoped>
.site-footer {
  margin-top: 4rem;
  background: var(--zc-dark);
  color: #aeb4bc;
  font-size: 0.88rem;
  border-top: 3px solid var(--zc-primary);
}
.site-footer__main {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem 2.25rem;
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) repeat(3, 1fr);
  gap: 2.5rem;
}
.site-footer__logo {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.6rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}
.site-footer__logo::after {
  content: '.';
  color: var(--zc-primary);
}
.site-footer__blurb {
  margin: 0.85rem 0 1.25rem;
  font-size: 0.85rem;
  line-height: 1.6;
  max-width: 30ch;
}
.site-footer__col {
  min-width: 0;
}
.site-footer__title {
  color: #fff;
  font-family: var(--font-condensed);
  font-size: 0.82rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--zc-primary);
  display: inline-block;
}
.site-footer__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.site-footer__list a {
  color: #aeb4bc;
  text-decoration: none;
  transition: color 0.15s;
}
.site-footer__list a:hover {
  color: #fff;
}
.site-footer__bottom {
  border-top: 1px solid #2a3138;
  text-align: center;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #7d848c;
}
.site-footer__bottom p {
  margin: 0.2rem 0;
}
.site-footer__addr {
  letter-spacing: 0.4px;
}
@media (max-width: 900px) {
  .site-footer__main {
    grid-template-columns: 1fr 1fr;
  }
  .site-footer__brand {
    grid-column: span 2;
  }
}
@media (max-width: 520px) {
  .site-footer__main {
    grid-template-columns: 1fr;
  }
  .site-footer__brand {
    grid-column: span 1;
  }
}
</style>