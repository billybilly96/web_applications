import Vue from "vue";
import Router from "vue-router";

import DashboardPage from "./views/DashboardPage";
import DocumentDetailPage from "./views/DocumentDetailPage";
import DocumentSearchPage from "./views/DocumentSearchPage";
import GeneralRulesPage from "./views/GeneralRulesPage";
import LoansGrantedPage from "./views/LoansGrantedPage";
import LoansObtainedPage from "./views/LoansObtainedPage";
import NotificationPage from "./views/NotificationPage";
import PersonalProfilePage from "./views/PersonalProfilePage";
import PersonalScorePage from "./views/PersonalScorePage";
import QrCodePage from "./views/QrCodePage";
import RegistrationPage from "./views/RegistrationPage";
import StudentDetailPage from "./views/StudentDetailPage";

Vue.use(Router);

export var router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", component: DashboardPage },
    { path: "/document-detail/:id", component: DocumentDetailPage },
    { path: "/document-search/:kind", component: DocumentSearchPage },
    { path: "/general-rules", component: GeneralRulesPage },
    { path: "/loans-granted/:type", component: LoansGrantedPage, beforeEnter: (to, from, next) => authGuard(next) },
    { path: "/loans-obtained/:type", component: LoansObtainedPage, beforeEnter: (to, from, next) => authGuard(next) },
    { path: "/notification", component: NotificationPage, beforeEnter: (to, from, next) => authGuard(next) },
    { path: "/personal-profile", component: PersonalProfilePage, beforeEnter: (to, from, next) => authGuard(next) },
    { path: "/personal-score", component: PersonalScorePage, beforeEnter: (to, from, next) => authGuard(next) },
    { path: "/qrcode/:id", component: QrCodePage },
    { path: "/registration", component: RegistrationPage },
    { path: "/student-detail/:user", component: StudentDetailPage },
    { path: "*", redirect: "/" }
  ]
})

async function authGuard(next) {
  try {
    await Vue.axios.get(Vue.prototype.serverHost + "/student/login");
    next();
  } catch (err) {
    next("/");
  }
}