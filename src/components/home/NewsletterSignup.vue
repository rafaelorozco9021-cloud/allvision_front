<template>
  <section id="newsletter" class="newsletter">
    <div class="newsletter__inner">
      <p class="newsletter__eyebrow">Recibe noticias en tu WhatsApp</p>
      <h3 class="newsletter__title">Lo más importante, directo a tu chat</h3>
      <p class="newsletter__text">
        Cada 30 minutos te enviamos las noticias más virales del momento, con foto,
        resumen y el enlace para leer el artículo completo en AllVision. Sin spam: cada
        noticia se envía una sola vez.
      </p>

      <form v-if="!done" class="newsletter__form" @submit.prevent="submit">
        <div class="newsletter__fields">
          <label class="newsletter__field">
            <span class="newsletter__label">Tu nombre</span>
            <input
              v-model.trim="name"
              type="text"
              class="newsletter__input"
              placeholder="Nombre"
              autocomplete="name"
            />
          </label>

          <label class="newsletter__field">
            <span class="newsletter__label">Tu correo</span>
            <input
              v-model.trim="email"
              type="email"
              class="newsletter__input"
              placeholder="correo@ejemplo.com"
              autocomplete="email"
            />
          </label>

          <label class="newsletter__field newsletter__field--wide">
            <span class="newsletter__label">Tu número de WhatsApp</span>
            <input
              v-model.trim="phone"
              type="tel"
              required
              class="newsletter__input"
              placeholder="300 123 4567"
              autocomplete="tel"
              inputmode="tel"
            />
          </label>
        </div>

        <button type="submit" class="newsletter__btn" :disabled="sending">
          {{ sending ? 'Enviando...' : 'Suscribirme' }}
        </button>

        <p v-if="error" class="newsletter__error" role="alert">{{ error }}</p>
      </form>

      <div v-else class="newsletter__done" role="status">
        <p class="newsletter__done-title">¡Listo, {{ name || 'bienvenido' }}!</p>
        <p class="newsletter__done-text">
          Te suscribiste al {{ maskedPhone }}. Recibirás las noticias más importantes
          automáticamente.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import apiClient from '../../services/api-client';

const name = ref('');
const email = ref('');
const phone = ref('');
const sending = ref(false);
const done = ref(false);
const error = ref('');

const maskedPhone = computed(() => {
  const digits = phone.value.replace(/\D/g, '');
  const tail = digits.slice(-4);
  return digits.length >= 4 ? `••• ${tail}` : 'tu número';
});

async function submit() {
  if (sending.value) return;
  error.value = '';

  if (phone.value.replace(/\D/g, '').length < 10) {
    error.value = 'El número debe tener al menos 10 dígitos.';
    return;
  }
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Revisa el formato del correo.';
    return;
  }

  sending.value = true;
  try {
    await apiClient.post('/whatsapp/subscribe', {
      phoneNumber: phone.value,
      email: email.value,
      name: name.value,
    });
    done.value = true;
    name.value = '';
    email.value = '';
    phone.value = '';
  } catch (e: any) {
    error.value =
      e?.response?.status === 404
        ? 'No pudimos guardar la suscripción. Intenta más tarde.'
        : 'Hubo un error al suscribirte. Intenta de nuevo.';
  } finally {
    sending.value = false;
  }
}
</script>

<style scoped>
.newsletter {
  margin-top: 3.5rem;
  background: var(--zc-ink);
  background-image:
    radial-gradient(circle at 12% 20%, rgba(200, 16, 46, 0.22), transparent 42%),
    radial-gradient(circle at 88% 80%, rgba(200, 16, 46, 0.15), transparent 40%);
  border-top: 4px solid var(--zc-primary);
  border-bottom: 4px solid var(--zc-primary);
  padding: 3.25rem 1.5rem;
  color: #fff;
}
.newsletter__inner {
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
}
.newsletter__eyebrow {
  font-family: var(--font-condensed);
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--zc-primary);
  margin: 0 0 0.6rem;
}
.newsletter__title {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: #fff;
  margin: 0 0 0.6rem;
}
.newsletter__text {
  margin: 0 0 1.6rem;
  color: #b9bec5;
  font-size: 0.95rem;
}
.newsletter__form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  max-width: 480px;
  margin: 0 auto;
}
.newsletter__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
}
.newsletter__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: left;
}
.newsletter__field--wide {
  grid-column: 1 / -1;
}
.newsletter__label {
  font-family: var(--font-condensed);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #8d949c;
}
.newsletter__input {
  width: 100%;
  padding: 0.8rem 1.1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: var(--font-sans);
  background: #fff;
  color: #1a1d21;
  outline: none;
  transition: border-color 0.15s;
}
.newsletter__input:focus {
  border-color: var(--zc-primary);
}
.newsletter__input::placeholder {
  color: #9aa1a9;
}
.newsletter__btn {
  padding: 0.8rem 1.5rem;
  border: none;
  background: var(--zc-primary);
  color: #fff;
  font-family: var(--font-condensed);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.newsletter__btn:hover:not(:disabled) {
  background: var(--zc-primary-strong);
}
.newsletter__btn:disabled {
  opacity: 0.6;
  cursor: progress;
}
.newsletter__error {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #ffd5db;
  background: rgba(200, 16, 46, 0.25);
  border: 1px solid rgba(200, 16, 46, 0.5);
  border-radius: 6px;
  padding: 0.5rem 0.9rem;
}
.newsletter__done {
  border: 1px solid rgba(200, 16, 46, 0.5);
  background: rgba(200, 16, 46, 0.2);
  border-radius: 8px;
  padding: 1.4rem 1.5rem;
}
.newsletter__done-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}
.newsletter__done-text {
  margin: 0;
  color: #ffd5db;
  font-size: 0.92rem;
}
@media (max-width: 520px) {
  .newsletter__fields {
    grid-template-columns: 1fr;
  }
}
</style>
