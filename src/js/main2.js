import { Jet } from "./modules/baza"
import { hiol } from "./modules/baza"
import search from "./modules/search"
import ak from "./modules/ak"
import alt from "./modules/cart"
window.addEventListener('DOMContentLoaded', () => {
    hiol()
    Jet('man')
    search()
    ak()
    alt()
})