import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddCardPage } from "../add-card/add-card";
import { OnboardingPage } from "../onboarding/onboarding";
import { AboutPage } from "../about/about";
import { CgPage } from "../cg/cg";
import {FaqPage} from "../faq/faq";
import {ConfidentialPolicyPage} from "../confidential-policy/confidential-policy";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";
import {InformationPage} from "../information/information";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
  
export class ContactPage {


  isConnected:boolean;

  constructor(public navCtrl: NavController,private storage:Storage) {

    this.isConnected=false;
    this.storage.get('isConnected').then(data =>{

      console.log("IS CONNECTED --> "+data)
        if(data===true)
          this.isConnected=true

        else this.isConnected=false


    })

  }

    ionViewDidEnter() {
        this.storage.get('isConnected').then(data =>{

            console.log("IS CONNECTED --> "+data)
            if(data===true)
                this.isConnected=true

            else this.isConnected=false


        })

    }



  // openAddCard() {
  //   this.navCtrl.push(AddCardPage, {
  //     param: true
  //   });
  // }

  openOnBoarding() {
    this.navCtrl.push(OnboardingPage)

  }

  // openAbout() {
  //   this.navCtrl.push(AboutPage)
  //
  // }

  openCg(){
      this.navCtrl.push(CgPage)
  }

  deconnect()
  {
    console.log("Je vais bien là ")
        this.isConnected=false
      this.storage.remove("isConnected").then(data=>
      {
          this.storage.forEach(a=>{
              console.log(a)
          })
          console.log("J'ai remove")}).catch(err=>{
              console.log(err)})
      this.storage.remove("user").then(data=>console.log("J'ai remove")).catch(err=>{console.log(err)})

  }
    openFaq(){
        this.navCtrl.push(FaqPage)
    }

    openPolicy(){
        this.navCtrl.push(ConfidentialPolicyPage)
    }

    openLogin()
    {
        this.navCtrl.push(LoginPage,{returnToBack:true})
    }

    openInfo()
    {
        this.navCtrl.push(InformationPage)
    }


}
