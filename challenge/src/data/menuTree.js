import {Node} from "../classes/Node"
import {Home} from "../pages/Home"
import {Clothes} from "../pages/Clothes"
import {Shoes} from "../pages/Shoes"
import {Contact} from "../pages/Contact"

const root = new Node({ title: "Menu", link: "/", component: null});

const home = new Node({ title: "Home", link: "/", component: Home});

const products = new Node({ title: "Products", link: "/products", component: null});

const clothes = new Node({ title: "Clothes", link: "/clothes", component: Clothes});

const shoes = new Node({ title: "Shoes", link: "/shoes", component: Shoes});

const contact = new Node({ title: "Contact", link: "/contact", component: Contact});

products.addChild(clothes);
products.addChild(shoes);

root.addChild(home)
root.addChild(products)
root.addChild(contact)

export const menuTree = root
