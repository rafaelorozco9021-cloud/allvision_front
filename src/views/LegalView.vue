<template>
  <div class="legal">
    <header class="legal__head">
      <h1 class="legal__title">AllVision</h1>
      <p class="legal__lead">
        Periódico digital. Esta página reúne quiénes somos, cómo tratamos el contenido de los
        medios, y cómo pedir la retirada de una nota.
      </p>
      <nav class="legal__nav" aria-label="Índice legal">
        <a v-for="s in secciones" :key="s.id" :href="`#${s.id}`">{{ s.label }}</a>
      </nav>
    </header>

    <!-- Nosotros -->
    <section id="nosotros" class="legal__block">
      <h2>Nosotros</h2>
      <p>
        AllVision es un <strong>agregador de noticias</strong>. No somos un medio: no redactamos
        las notas, no tenemos redacción propia y no cobramos por publicarlas.
      </p>
      <p>
        Recolectamos automáticamente los feeds RSS públicos de medios de prensa y agrupamos las
        noticias que varios medios cubren la misma historia, de modo que el lector vea una sola
        entrada por tema en lugar de cinco notas parecidas. Cada entrada enlaza al medio de origen.
      </p>
      <p>
        La portada se actualiza de forma programada cada 30 minutos. No tenemos una redacción ni
        publicamos notas propias.
      </p>

      <h3>Datos del responsable</h3>
      <p>
        <strong>AllVision</strong> es una publicación digital privada, editada y publicada por
        una persona natural inscrita en el Registro Único Tributario de la DIAN.
      </p>
      <p>
        <strong>No publicamos el NIT.</strong> Tratándose de un contribuyente persona natural,
        el número de identificación tributaria es un dato personal protegido por la Ley 1581 de
        2012 (dato semiprivado) y la Ley 1712 de 2014 (art. 7), que restringe la publicación de
        datos de particulares sin consentimiento expreso. La identificación completa puede
        verificarse ante la DIAN o solicitarse a
        <a :href="`mailto:${contact}`">{{ contact }}</a>, y se entrega a quien la solicite
        acreditando su interés legítimo.
      </p>
      <p>
        <strong>No publicamos el domicilio.</strong> La dirección física del titular se reserva
        por la misma razón y no se difunde en este sitio.
      </p>
      <p>
        <strong>Contacto:</strong>
        <a :href="`mailto:${contact}`">{{ contact }}</a>
      </p>
    </section>

    <!-- Contenido -->
    <section v-if="policy" id="contenido" class="legal__block">
      <h2>Qué mostramos y qué no</h2>
      <p>{{ policy.nature }}</p>
      <div class="legal__cols">
        <div>
          <h3>Mostramos</h3>
          <ul>
            <li v-for="item in policy.contentShown" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          <h3>No mostramos</h3>
          <ul>
            <li v-for="item in policy.notShown" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Imágenes -->
    <section v-if="policy" id="imagenes" class="legal__block">
      <h2>Fotografías</h2>
      <p>{{ policy.imagesPolicy }}</p>
      <p>
        Las notas sin fotografía muestran un aviso de <em>Imagen no disponible</em> indicando el
        motivo. No sustituimos la foto por imágenes genéricas de banco: una imagen que no
        corresponde al hecho se prestaría a error.
      </p>
    </section>

    <!-- IA -->
    <section v-if="policy" id="ia" class="legal__block">
      <h2>Titulares reescritos con IA</h2>
      <p>{{ policy.aiPolicy }}</p>
      <p>
        Cuando un titular se reescribe, se guarda también el titular original y ambos se pueden
        comparar. Los titulares defectuosos se descartan automáticamente y se conserva la
        versión limpia del medio. Aun así, un titular reescrito es responsabilidad editorial de
        AllVision: si encuentras uno que no refleje la noticia, escríbenos.
      </p>
    </section>

    <!-- Términos -->
    <section id="terminos" class="legal__block">
      <h2>Términos y condiciones</h2>

      <h3>1. Naturaleza del servicio</h3>
      <p>
        AllVision ofrece un índice de noticias de acceso público. El contenido publicado por los
        medios es de su exclusivo titular y se enlaza, no se reproduce en su totalidad.
      </p>

      <h3>2. Enlaces a terceros</h3>
      <p>
        Cada nota enlaza a un sitio ajeno. No controlamos esos sitios ni respondemos por su
        contenido, sus cambios o su disponibilidad. Los enlaces se ofrecen por comodidad.
      </p>

      <h3>3. Exactitud</h3>
      <p>
        Buscamos ser fieles al título, la foto y el texto fiel a la fuente. Aun así no garantizamos que
        la información sea completa, exacta o esté actualizada. AllVision no se hace responsable
        de decisiones que tomes con base en ella.
      </p>

      <h3>4. Uso del sitio</h3>
      <p>
        El acceso es libre y no requiere registro. Queda prohibida la extracción masiva o
        automatizada del contenido, y cualquier uso que suponga presentarlo como propio.
      </p>

      <h3>5. Retirada de contenido</h3>
      <p>
        Un medio o titular de derechos puede pedir que retiremos una nota en cualquier momento y
        sin necesidad de acreditar la titularidad más allá de identificar la publicación. Basta
        con escribirnos.
      </p>
    </section>

    <!-- Privacidad -->
    <section id="privacidad" class="legal__block">
      <h2>Política de privacidad</h2>

      <h3>Qué recopilamos</h3>
      <p>
        <strong>No hay registro de usuarios.</strong> No usamos cookies propias, ni Google
        Analytics, ni ningún script de seguimiento o publicidad. No existe formulario de
        suscripción, newsletter ni perfil.
      </p>

      <h3>Qué guardamos en el servidor</h3>
      <ul>
        <li>El titular, un fragmento breve, la URL y el medio de cada nota que encontramos.</li>
        <li>La dirección IP de las peticiones, en el registro temporal del servidor y de la base de datos.</li>
        <li>El número de WhatsApp, solo si te suscribes voluntariamente al canal de diffusion.</li>
      </ul>

      <h3>A quién se envían esos datos</h3>
      <ul>
        <li>
          <strong>Neon</strong> — base de datos en Estados Unidos. Ahí queda el histórico de
          notas, incluyendo los títulos originales de los medios.
        </li>
        <li>
          <strong>NVIDIA</strong> — al reescribir un titular, el texto del titular viaja a su API
          de inferencia. NVIDIA declara que sus endpoints de prueba no usan los datos para
          entrenar y que la sesión queda registrada por seguridad.
        </li>
        <li>
          <strong>Evolution API</strong> — si te suscribes al canal de WhatsApp, tu número y los
          mensajes se envían a ese proveedor para hacer el envío.
        </li>
      </ul>

      <h3>Tus derechos</h3>
      <p>
        Puedes pedir información sobre tus datos, corregirlos o que se eliminen escribiendo a
        <a :href="`mailto:${contact}`">{{ contact }}</a>. Responderemos en menos de 15 días
        hábiles.
      </p>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="legal__block legal__takedown">
      <h2>Contacto y retirada de contenido</h2>
      <p>
        Para cualquier consulta escribe a
        <a :href="`mailto:${contact}`">{{ contact }}</a>. Si eres un medio y quieres retirar una
        nota, puedes usar el formulario de abajo o mandar un correo con la URL del artículo
        original. Responderemos en menos de 48 horas hábiles.
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
  contact: string;
}

const API = import.meta.env.VITE_API_URL || '';
const policy = ref<Policy | null>(null);
const contact = ref('contact@allvision.space');
const sending = ref(false);
const result = ref<{ ok: boolean; message: string } | null>(null);

const secciones = [
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'imagenes', label: 'Fotografías' },
  { id: 'ia', label: 'IA' },
  { id: 'terminos', label: 'Términos' },
  { id: 'privacidad', label: 'Privacidad' },
  { id: 'contacto', label: 'Contacto' },
];

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
  max-width: 780px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}
.legal__title {
  font-family: var(--font-serif);
  font-size: clamp(1.7rem, 3.5vw, 2.3rem);
  line-height: 1.2;
  margin: 0 0 0.5rem;
  color: var(--zc-ink);
}
.legal__lead {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--zc-muted);
  margin: 0 0 1.25rem;
  max-width: 62ch;
}
.legal__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-bottom: 1.25rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--zc-border);
}
.legal__nav a {
  font-family: var(--font-condensed);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--zc-muted);
  border: 1px solid var(--zc-border);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
}
.legal__nav a:hover {
  color: var(--zc-primary);
  border-color: var(--zc-primary);
}
.legal__block {
  border-top: 2px solid var(--zc-primary);
  padding-top: 0.9rem;
  margin-top: 2.25rem;
  scroll-margin-top: 1.5rem;
}
.legal__block h2 {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  color: var(--zc-ink);
}
.legal__block h3 {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--zc-muted);
  margin: 1.4rem 0 0.4rem;
}
.legal__block p,
.legal__block li {
  font-size: 0.95rem;
  line-height: 1.68;
  color: var(--zc-muted);
  margin: 0 0 0.75rem;
}
.legal__block ul {
  margin: 0 0 0.75rem;
  padding-left: 1.15rem;
}
.legal__block a {
  color: var(--zc-primary);
}
.legal__cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}
.legal__form {
  display: grid;
  gap: 0.9rem;
  margin-top: 1.25rem;
  max-width: 520px;
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
  color: var(--zc-muted);
}
.legal__form input,
.legal__form textarea {
  font: inherit;
  font-size: 0.95rem;
  padding: 0.6rem 0.7rem;
  border: 1px solid var(--zc-border);
  border-radius: 4px;
  background: #fff;
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
