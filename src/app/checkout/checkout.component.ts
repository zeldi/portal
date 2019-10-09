import { Component, OnInit, Injectable, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import {TicketService} from '../../services/ticket.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../services/header.service';
import { Router, Event, NavigationStart, NavigationError, NavigationEnd } from '@angular/router';

@Injectable()

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  validatingForm: FormGroup;
  check:false;
  marked = false;
  count = 0;
  type = 'company';
  totalItem;
  totalPrice;
  cartCount: number;
  totalToken: number;
  btnCheckout = "";
  acctManagerName;
  acctManagerOrgName;

  
  constructor(
    public router: Router,
    private myHeader: HeaderService,
    private myCart: CartService,
    private myTicket: TicketService) { 

      this.router.events
    .subscribe((event) => {
  
  
    });
    
    this.myTicket.currentTotalItem.subscribe(val => this.totalItem = val);
    this.myTicket.currentTotalPrice.subscribe(val => this.totalPrice = val);

    }


  ngOnInit() {
    this.validatingForm = new FormGroup({
     projectname: new FormControl(null, Validators.required),
     projectdesc: new FormControl(null, Validators.required)
    });

    this.myHeader.setModePayment();
    this.myCart.currentCartValue.subscribe(val => this.cartCount = val);

    // Get the list of Account Managers
    // and assign to the variables
    this.myTicket.getAcctManagerList()
      .then(res => {
        // @ts-ignore
        const myInfo = res.info;
        const myDetails = JSON.parse(localStorage.getItem('userInfo'));

        if (!myInfo.length) {
          console.log ('Account Manager List is EMPTY');
          this.acctManagerName = 'Mohammad Harris bin Mokhtar (DEFAULT)';
          this.acctManagerOrgName = myDetails.orgName;
        } else {
          this.acctManagerName = myInfo[0].name;
          this.acctManagerOrgName = myInfo[0].orgName;
        }
      })

      
      
      .catch(err => {
        console.error ('Unable to get the Account Manager list');
        console.error (err);
      });
  }

  get projectname() {
    return this.validatingForm.get('projectname');
   }

  get projectdesc() {
    return this.validatingForm.get('projectdesc');
   }

   Accept(e:any) {
    if (e.checked === true) {
      this.marked = true;   
    } 
    else {
      this.marked=false;
    }
    console.log (e);
  }
 

  btnPlaceOrder() {
   
    this.myTicket.placeOrder(this.validatingForm.get('projectname').value, this.validatingForm.get('projectdesc').value)
      .then(res => {
        // Remarks: Redirect to the ticket page
        // console.log ("Redirect to the ticket page");
        this.router.navigate(['ticket']);
      })
      .catch(err => {
        console.error (err);

        // Remarks: Need to show the error in SWAL
        if (err.status === 400) {
          Swal.fire(
            'The backend?',
            'Something is wrong!',
            'question'
          );
        } else {
          Swal.fire(
            'Unknown error',
            'Something is wrong!',
            'question'
          );
        }


      }); 
  }

}

