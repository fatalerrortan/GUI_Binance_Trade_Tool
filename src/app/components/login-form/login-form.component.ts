import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BinanceTradeToolService } from '../../services/binance-trade-tool.service';
// import { Router } from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private BinanceTradeToolService: BinanceTradeToolService) { 
    // Called first time before the ngOnInit()
  }

  ngOnInit(): void {
    // Called after the constructor and called  after the first ngOnChanges()
    // this.router.navigate(["/"]);
  }

  isNewRun_view: boolean = true;
  isAttach_view: boolean = false;

  newrun_active: boolean = false;
  attach_active: boolean = false;

  exe_mode: string = "newrun";
  trade_rule_sell: any;
  trade_rule_buy: any;
  trade_rule_source: any;
  server_url: any;

  trade_rule_block: boolean = false;

  exe_mode_options = [
    {name: 'productive', abbrev: 'prod'},
    {name: 'test', abbrev: 'test'}
  ];

  candle_interval_options = [
    {name: '1m'},
    {name: '3m'},
    {name: '5m'},
    {name: '15m'},
    {name: '30m'},
    {name: '45m'},
    {name: '1h'},
    {name: '2h'},
    {name: '3h'},
    {name: '4h'}
  ];

  current_orders_options = [
    {name: 'yes', abbrev: 'yes'},
    {name: 'no', abbrev: 'no'}
  ];
  // http://127.0.0.1:9898
  host_url = new FormControl("http://127.0.0.1:9898", {validators: Validators.required, updateOn: 'submit'});
  taapi_api_key = new FormControl(null, {validators: Validators.required, updateOn: 'submit'});
  binance_api_key = new FormControl(null, {validators: Validators.required, updateOn: 'submit'});
  binance_secret_key = new FormControl(null, Validators.required);

  _exe_mode = new FormControl(this.exe_mode_options[1], {validators: Validators.required, updateOn: 'submit'});
  candle_interval = new FormControl(this.candle_interval_options[2], {validators: Validators.required, updateOn: 'submit'});
  current_orders = new FormControl(this.current_orders_options[1], {validators: Validators.required, updateOn: 'submit'});
  trade_rule = new FormControl(null, {validators: Validators.required, updateOn: 'submit'});

  login_newrun_form = new FormGroup({ 
    
    connection: new FormGroup({ 
      host_url: this.host_url,
      taapi_api_key: this.taapi_api_key,
      binance_api_key: this.binance_api_key,
      binance_secret_key: this.binance_secret_key
    }),

    exe_config: new FormGroup({ 
      exe_mode: this._exe_mode,
      candle_interval: this.candle_interval,
      current_orders: this.current_orders,
      trade_rule: this.trade_rule
    }),
    
  });

  attach_host_url = new FormControl("http://127.0.0.1:9898", {validators: Validators.required, updateOn: 'submit'});
  attach_taapi_api_key = new FormControl(null, {validators: Validators.required, updateOn: 'submit'});
  
  login_attach_form = new FormGroup({ 
    
    connection: new FormGroup({ 
      host_url: this.attach_host_url,
      taapi_api_key: this.attach_taapi_api_key
    }) 
  });


  activate_newrun() {
    this.isNewRun_view = true;
    this.isAttach_view = false;
    this.exe_mode = "newrun";
  }

 activate_attach() {
  this.isNewRun_view = false;
  this.isAttach_view = true;
  this.exe_mode = "attach";
 }
  
  updateName() {
    // this.taapi_api_key.setValue('Nancy');
  }

  onFileChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    if (element.files!.length > 0) {
      this.trade_rule_source = element.files![0];
      const fileReader = new FileReader();
      fileReader.readAsText(this.trade_rule_source, "UTF-8");
      fileReader.onload = () => {
        this.trade_rule_sell = JSON.parse(fileReader.result!.toString())["sell"];
        // this.trade_rule_sell = Object.keys(this.trade_rule_sell).map(key => this.trade_rule_sell[key]);

        this.trade_rule_buy = JSON.parse(fileReader.result!.toString())["buy"];
        // this.trade_rule_buy = Object.keys(this.trade_rule_buy).map(key => this.trade_rule_buy[key]);
        this.trade_rule_block = true;
        // this.router.navigate([], { fragment: "trade_rule_block" });
        
        console.log(this.trade_rule_sell);
        console.log(this.trade_rule_buy);
      }
    }
  }

  onSubmit_newrun() {
    // TODO: Use EventEmitter with form value
    // console.info(this.login_form.value);

    if (this.login_newrun_form.invalid){
      alert("Warning: Please fill all the required fields and try again!");
      return console.warn("newrun form data not invalid");
    }

    let formData = new FormData();
    
    formData.append('taapi_api_key', this.login_newrun_form.get(['connection', 'taapi_api_key'])!.value);
    formData.append('binance_api_key', this.login_newrun_form.get(['connection', 'binance_api_key'])!.value);
    formData.append('binance_secret_key', this.login_newrun_form.get(['connection', 'binance_secret_key'])!.value);

    formData.append('exe_mode', this.login_newrun_form.get(['exe_config', 'exe_mode'])!.value.name);
    formData.append('candle_interval', this.login_newrun_form.get(['exe_config', 'candle_interval'])!.value.name);
    formData.append('current_orders', this.login_newrun_form.get(['exe_config', 'current_orders'])!.value.name);
    formData.append('trade_rule', this.trade_rule_source);  

    this.server_url = this.login_newrun_form.get(['connection', 'host_url'])!.value;
 
    if (this.server_url[this.server_url.length - 1] != "/") {
      this.server_url += "/";
    }
 
    this.BinanceTradeToolService.run(this.server_url, formData).subscribe(
      raw_result => {
        let result = JSON.parse(raw_result);
        console.log(result);
        if (result["status"] == "ok") {
          this.attach_active = false;
          this.newrun_active = true;
        }else {
          alert(result["body"]);
        }
      }
    );
    
  //   for (var value of formData.entries()) {
  //     console.log(value); 
  //  }
  }

  onSubmit_attach(){
      if (this.login_attach_form.invalid){
        alert("Warning: Please fill all the required fields and try again!");
        return console.warn("attach form data not invalid");
      }
  }

  stop(){
    this.BinanceTradeToolService.stop(this.server_url).subscribe(
      raw_result => {
        let result = JSON.parse(raw_result);
        console.log(result);
        if (result["status"] == "ok") {
          this.attach_active = false;
          this.newrun_active = false;
          alert(result["body"]);
        }else {
          alert(result["body"]);
        }
      }
    );
  }

  deattach(){
    alert("deattach");
    return console.log("deattach");
  }

  inactive_color(){
    console.log("called");
  }
}
