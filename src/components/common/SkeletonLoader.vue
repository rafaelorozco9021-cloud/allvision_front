<template>
  <div class="skeleton-loader">
    <div class="skeleton-image skeleton-pulse"></div>
    <div class="skeleton-content">
      <div class="skeleton-tag skeleton-pulse"></div>
      <div class="skeleton-title skeleton-pulse"></div>
      <div class="skeleton-text skeleton-pulse"></div>
      <div class="skeleton-text-short skeleton-pulse"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-loader {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
}
.skeleton-image {
  width: 170px;
  height: 110px;
  border-radius: 5px;
  flex-shrink: 0;
  background: #e6e6e6;
}
.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  justify-content: center;
}
.skeleton-tag {
  height: 11px;
  border-radius: 3px;
  width: 35%;
  background: #eceaea;
}
.skeleton-title {
  height: 18px;
  border-radius: 4px;
  width: 85%;
  background: #e0e0e0;
}
.skeleton-text {
  height: 12px;
  border-radius: 3px;
  width: 100%;
  background: #ebebeb;
}
.skeleton-text-short {
  height: 12px;
  border-radius: 3px;
  width: 60%;
  background: #ebebeb;
}
.skeleton-pulse {
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>