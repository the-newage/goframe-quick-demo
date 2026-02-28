// src/boot/vue-query.ts
import { VueQueryPlugin } from '@tanstack/vue-query';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.use(VueQueryPlugin);
});
