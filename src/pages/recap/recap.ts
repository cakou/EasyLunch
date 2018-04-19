import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {LoginPage} from '../login/login';
import {RestProvider} from "../../providers/rest/rest";
import {AddCardPage} from "../add-card/add-card";


@IonicPage()
@Component({
    selector: 'page-recap',
    templateUrl: 'recap.html',
})
export class RecapPage {

    entree: boolean;
    plat: boolean;
    dessert: boolean;
    menu: boolean;

    entreeList: any[]
    platList: any[]
    dessertList: any[]
    menuList: any[];
    menuMeal: any[];

    nameMenu: string;

    platMap: any;


    img: any;
    address: string;

    name: string;
    desc: string;
    city: string;

    schedule: any;
    nbPers: any;
    meals: any;
    menus: any;

    errorMessage: string;

    total: number;

    printCode: boolean

    code: string;

    jsonChoosenMenu: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public rest: RestProvider) {

        this.img = navParams.get('img');
        this.address = navParams.get('address');
        this.name = navParams.get('name');
        this.desc = navParams.get('desc');
        this.city = navParams.get('city');

        this.entreeList = this.entreeList || [];
        this.platList = this.platList || [];
        this.dessertList = this.dessertList || [];
        this.menuList = this.menuList || [];
        this.menuMeal = this.menuMeal || [];
        this.jsonChoosenMenu = this.jsonChoosenMenu || [];
        this.total = 0;
        this.printCode = false;


        if (!navParams.get('book')) {
            this.init()
        }

        else {

            this.platMap = new Map()

            this.printCode = this.navParams.get('printCode')

            this.nbPers = navParams.get('nbPers')

            let scheduleString = (navParams.get('schedule')).toString()

            let scheduleFormat = "";
            for (let i = 0; i < scheduleString.length; i++) {

                if (i == scheduleString.length - 2)
                    scheduleFormat += 'h'

                scheduleFormat += scheduleString.charAt(i)
            }
            this.schedule = scheduleFormat


            this.getMeals(navParams.get('restoId'))
            if (this.printCode)
                this.getCode()

        }


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RecapPage');
    }

    openLogin() {
        console.log("ok commande validé !");
        this.storage.get("isConnected").then(
                data=> {if(data===true)
                {
                    this.navCtrl.push(AddCardPage);
                }
                else
                {
                    this.navCtrl.push(LoginPage);
                }},
            error=>console.log("err --> "+error)

        )

    }

    goBack() {
        this.navCtrl.pop();
    }


    private init() {
        this.storage.set('entree', this.navParams.get('entree'))
        this.storage.set('plat', this.navParams.get('plat'))
        this.storage.set('dessert', this.navParams.get('dessert'))
        this.storage.set('total', this.navParams.get('total'))
        this.total = this.navParams.get('total')
        this.jsonChoosenMenu=this.navParams.get('jsonChoosen')

        this.entree = false;
        this.plat = false;
        this.dessert = false;

        this.menu = false;

        if (this.navParams.get('plat').length > 0) {

            this.platList = this.navParams.get('plat')
            this.plat = true

        }
        if (this.navParams.get('entree').length > 0) {
            this.entree = true
            this.entreeList = this.navParams.get('entree')
        }
        if (this.navParams.get('dessert').length > 0) {
            this.dessertList = this.navParams.get('dessert')
            this.dessert = true

        }
        if (this.navParams.get('menuMeal').length > 0) {
            this.menuList = this.navParams.get('menuMeal')

            console.log("OOOOO ---> " + JSON.stringify(this.menuList))
            this.nameMenu = this.navParams.get('menu').name
            this.menu = true
        }
        if (this.navParams.get('special').length > 0) {
            this.storage.set('special', this.navParams.get('special'))
        }
        this.storage.get('schedule').then(data => {
            this.schedule = data
            console.log("DATA --> " + data)
        }, error => console.error(error))


        this.storage.get('nbPers').then(data => {
            this.nbPers = data
            console.log("DATA --> " + data)
        }, error => console.error(error))

    }

    private getMeals(id) {
        this.rest.getMeals(id)

            .subscribe(
                data => {
                    this.meals = data[0].meal;
                    this.menus = data[0].menu;
                    this.formatData()

                },
                error => this.errorMessage = <any>error);

    }

    private formatData() {

        this.meals.map(m => {


            switch (m.plat) {
                case 0:

                    this.platMap.set(m.id, m.name)
                    break;
                case 1:

                    this.platMap.set(m.id, m.name)
                    break;
                case 2:

                    this.platMap.set(m.id, m.name)
                    break;
            }

        })

        if (this.navParams.get('mealId') != null) {
            this.meals.map(m => {

                if (this.navParams.get('mealId').indexOf(m.id) != -1) {
                    switch (m.plat) {
                        case 0:
                            this.entreeList.push(m)
                            this.entree = true;

                            break;
                        case 1:
                            this.platList.push(m)
                            this.plat = true;

                            break;
                        case 2:
                            this.dessertList.push(m)
                            this.dessert = true;

                            break;
                    }
                }

            })
        }
        if (this.navParams.get('menu') != null) {
            this.menu = true

            let obj = this.navParams.get('menu')
            Object.keys(obj).map(key => {
                let json
                let name
                let price
                let mealName = []

                this.menus.map(m => {
                    console.log("M ID --> " + m.id + " KEY --> " + key)

                    if (m.id == key) {
                        name = m.name
                        price = m.price

                    }
                })
                obj[key].map(idMeal => {
                    mealName.push(this.platMap.get(idMeal))
                    console.log("ID MEAL --> " + idMeal)

                })
                 json = {"name": name, "mealName": mealName, "price":price}
                 this.jsonChoosenMenu.push(json)

            })
            console.log(obj)


        }


    }

    private getCode() {

        let arg = this.navParams.get('bookingId').toString() + '?booking=true'
        console.log(arg)
        this.rest.getCodeByBookingId(arg)

            .subscribe(
                data => {
                    this.code = data.name
                },
                error => this.errorMessage = <any>error);

    }
}
