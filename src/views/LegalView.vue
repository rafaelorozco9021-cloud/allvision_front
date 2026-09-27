<template>
  <div class="legal">
    <header class="legal__head">
      <h1 class="legal__title">Contenido, imágenes y derechos</h1>
      <p class="legal__lead">
        AllVision es un agregador de noticias. No alojamos los artículos originales: cada nota
        enlaza a la fuente y por eso no podemos reenviar el texto de los medios.
      </p>
    </header>

    <div v-if="policy" class="legal__grid">
      <section class="legal__block">
        <h2>Qué mostramos</h2>
        <ul>
          <li v-for="item in policy.contentShown" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="legal__block">
        <h2>Qué no mostramos</h2>
        <ul>
          <li v-for="item in policy.notShown" :key="item">{{ item }}</li>
        </ul>
      </section>

      <section class="legal__block legal__block--wide">
        <h2>Política de imágenes</h2>
        <p>{{ policy.imagesPolicy }}</p>
      </section>

      <section class="legal__block legal__block--wide">
        <h2>Titulares reescritos por IA</h2>
        <p>{{ policy.aiPolicy }}</p>
      </section>

      <section class="legal__block legal__block--wide">
        <h2>Identificación del scraper</h2>
        <p>{{ policy.compliance }}</p>
      </section>
    </div>

    <section class="legal__block legal__takedown">
      <h2>Retirar una nota</h2>
      <p>
        Si eres un medio o titular de derechos y consideras que una nota no debe mostrarse,
        envíanos la URL del artículo original. Respondemos en menos de 48 horas hábiles.
        Escríbenos también a
        <a :href="`mailto:${contact}`">{{ contact }}</a>.
      </p>

      <form class="legal__form" @submit.prevent="submit">
        <label>
          <span>URL del artículo original *</span>
          <input v-model.trim="form.originalUrl" type="url" required placeholder="https://..." />
        </label>
        <label>
          <span>Medio o titular de derechos *</span>
          <input v-model.trim="form.claimant" type="text" required minlength="2" />
        </label>
        <label>
          <span>Correo de contacto *</span>
          <input v-model.trim="form.contactEmail" type="email" required />
        </label>
        <label>
          <span>Motivo *</span>
          <textarea
            v-model.trim="form.reason"
            required
            minlength="10"
            rows="4"
            placeholder="Qué se retira y con qué fundamento"
          ></textarea>
        </label>
        <button type="submit" :disabled="sending">
          {{ sending ? 'Enviando…' : 'Enviar solicitud' }}
        </button>
      </form>

      <p v-if="result" class="legal__result" :class="{ 'legal__result--ok': result.ok }">
        {{ result.message }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

interface Policy {
  site: string;
  nature: string;
  contentShown: string[];
  notShown: string[];
  imagesPolicy: string;
  aiPolicy: string;
  compliance: string;
  contact: string;
}

const API = import.meta.env.VITE_API_URL || '';
const policy = ref<Policy | null>(null);
const contact = ref('contact@allvision.space');
const sending = ref(false);
const result = ref<{ ok: boolean; message: string } | null>(null);

const form = reactive({ originalUrl: '', claimant: '', contactEmail: '', reason: '' });

onMounted(async () => {
  try {
    const r = await fetch(`${API}/legal`);
    if (!r.ok) return;
    policy.value = await r.json();
    contact.value = policy.value.contact;
  } catch {
    /* la pagina se muestra igual sin la politica dinamica */
  }
});

async function submit() {
  sending.value = true;
  result.value = null;
  try {
    const r = await fetch(`${API}/legal/takedown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    result.value = {
      ok: r.ok,
      message: r.ok
        ? `Recibido. Retiramos "${data.news.title}" del feed.`
        : data.message || 'No pudimos procesar la solicitud.',
    };
    if (r.ok) Object.assign(form, { originalUrl: '', claimant: '', contactEmail: '', reason: '' });
  } catch {
    result.value = { ok: false, message: 'Error de red. Intenta de nuevo o escribe al correo.' };
  } finally {
    sending.value = false;
  }
}
</script>

<style scoped>
.legal {
  max-width: 760px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}
.legal__title {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  line-height: 1.2;
  margin: 0 0 0.75rem;
  color: var(--zc-ink);
}
.legal__lead {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--zc-muted, var(--zc-faint));
  margin: 0 0 2rem;
  max-width: 62ch;
}
.legal__grid {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}
.legal__block {
  border-top: 2px solid var(--zc-primary);
  padding-top: 0.9rem;
}
.legal__block h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.6rem;
  color: var(--zc-ink);
}
.legal__block p,
.legal__block li {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--zc-faint);
}
.legal__block ul {
  margin: 0;
  padding-left: 1.1rem;
}
.legal__block li {
  margin-bottom: 0.35rem;
}
.legal__form {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.25rem;
}
.legal__form label {
  display: grid;
  gap: 0.3rem;
}
.legal__form span {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--zc-faint);
}
.legal__form input,
.legal__form textarea {
  font: inherit;
  font-size: 0.95rem;
  padding: 0.6rem 0.7rem;
  border: 1px solid var(--zc-border, var(--zc-hair));
  border-radius: 4px;
  background: var(--zc-surface);
  color: var(--zc-ink);
}
.legal__form button {
  justify-self: start;
  font: inherit;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.65rem 1.4rem;
  border: none;
  border-radius: 4px;
  background: var(--zc-primary);
  color: #fff;
  cursor: pointer;
}
.legal__form button:disabled {
  opacity: 0.55;
  cursor: default;
}
.legal__result {
  margin-top: 1rem;
  padding: 0.7rem 0.85rem;
  border-radius: 4px;
  background: rgba(180, 40, 40, 0.09);
  border-left: 3px solid #b42828;
  font-size: 0.9rem;
  color: var(--zc-ink);
}
.legal__result--ok {
  background: rgba(30, 120, 60, 0.1);
  border-left-color: #1e783c;
}
</style>
