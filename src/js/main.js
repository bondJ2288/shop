import modal from "./modules/modal";
import { Jet, hiol } from "./modules/baza";
import slider from "./modules/slider";
import search from "./modules/search";
import ak from "./modules/ak";
import addUser from "./modules/login";
import auth2 from "./modules/auth";
import alt from "./modules/cart";
import accountModal from "./modules/clear";
import load from "./modules/mod2";
import history from "./modules/history";

window.addEventListener('DOMContentLoaded', () => {
    accountModal();
    auth2();
    addUser();
    hiol();
    modal();
    slider();
    Jet();
    search();
    ak();
    alt();
    history();

    // Переносим вызов функции load в самый конец
    load();
});
