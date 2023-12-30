class Address {
    public transferHistory=[]
    user:string=""
    address:string=""
    balance:number=1000
    private transfer:Transfer
    constructor(address,user=""){
        this.address=address
        this.user=user
    }
    setTransfer(chain){
        this.transfer=new Transfer(chain)
    }
    transferTo(to, amount){
        this.transfer.from=this
        this.transfer.to=to
        //this.transfer.amount=amount
        this.transfer.transfer(amount)
        this.transferHistory.push({
            from:this.address,
            to:to.address,
            timestamp:this.transfer.gettimestamp(),
            amount:amount
        })
    }
    
}
class Transfer {
 public from:Address=<Address>{}
 public to:Address=<Address>{}
 private timestamp=0
  private chain:Chain
  constructor(chain){
      this.chain=chain
  }
  transfer(amount){
      if ((chain.checkAddress(this.from.address))
          &&(chain.checkAddress(this.to.address)))
           {
            chain.addtrans(chain.getlast(),
      this.from.address,
      this.to.address,
      amount               
       )
      amount-=chain.getfee()
      this.timestamp=Date.now()
      this.from.balance-=amount
      this.to.balance+=amount
      }
      else{
          console.log("check addresses")
      }
  }
   gettimestamp (){return this.timestamp;}

    
}




class Block{
  type=""
  trans=[]
  prevhash=""
  hash=""
  timestamp=0
  constructor(trans,prevhash="",timestamp=Date.now()){
    this.prevhash=prevhash
    this.trans=trans
    this.timestamp=timestamp
    
    this.ghash()
  }
  addtrans(trans){
   
  this.trans.push(trans)
  this.ghash()
    
    
  }
  ghash(){
    let b=Buffer.from(
      this.prevhash+
      JSON.stringify(this.trans)+
      JSON.stringify(this.timestamp))
      this.hash=crypt.
      createHash("sha256")
      .update(b).digest("hex")
    
    
  }
}


class Trans{
  private from=""
  private to=""
  private amount=0
  private hash="" 
  private timestamp=0
  //private blchash=""
  constructor(from,to,amount){
    this.from=from
    this.to=to
    this.amount=amount 
    this.timestamp=Date.now()
    this.ghash()
  }
  ghash(){
      let b=Buffer.from(
      JSON.stringify(this.timestamp))
      this.hash=crypt.
      createHash("sha256")
      .update(b).digest("hex")
    
  }
  gethash(){return this.hash;}
  //setblchash(hash){this.blchash=hash;}
  
}

class Chain
{
 private fee:number=0.0001
 private Supply:number=30*Math.pow(10,20)
 private address0:string="0".repeat(16)
 private addresses:string[]=[]
 static address:number=1
 private maxTrans:number=2 
 public blocks:Block[]=[]
 public pending_trans:Trans[]=[]
  constructor(){
      //console.log(this.maxTrans)
      this.syncT()
  }
  add(b:Block){this.blocks.push(b);}
  checkAddress(address:string){
     return this.addresses.includes(address)
  }
  getfee(){return this.fee;}
  getlast(){
    return this.blocks[this.blocks.length-1];
   }
   createintial()
   {
    let block=new Block([]);
     block.type="initial";
     block.ghash()
     this.add(block);
   }
   createblock(trans:Trans[],hash:string){
     this.add(
       new Block(trans,hash));
   }
   
  addtrans(block:Block,from:string="",to:string="", amount:number=0){
    let trans=new Trans(from,to,amount);
    block=this.getlast();
    if (block.type!="initial"){
       if(block.trans.length==this.maxTrans)
        {
          this.createblock([],block.hash);
        }
        else{
            this.confirm()
        }
        
        //this.getlast().addtrans(trans)
  }
  if(block.type=="initial"){
    this.createblock([],block.hash);
   }
   this.pending_trans.push(trans)
   this.confirm()
   //this.getlast().addtrans(trans);
  // Block.updatetransSblchash(this.getlast())
  }
 createAddress(user:string=""):Address {
    let _address:any={};
    let address: Address
    let crypt=require("crypto")
    let buff=crypt.randomBytes(32)
    let b=Buffer.concat([buff,Buffer.from(Chain.address.toString())])
    _address=b.toString("hex")
         //console.log(_address)
    address=new Address(_address)
    address.setTransfer(this)
    this.addresses.push(address.address)
    Chain.address+=1
    //console.log(address)
    return address 
     
 }
 confirm(){
 let trans=this.pending_trans
/* for(var i of trans){
  lastblock.trans.push(i)
 }*/
  trans.map(t=>{
   this.getlast().addtrans(t)
  })
  this.getlast().ghash()
  this.valid()
 }
 syncT(){
      let c:Chain =this
      //let _fs:any;
      import("fs").then(fs=>{

        fs.exists("chain.json",(exists:boolean)=>{
          if(exists==false){
              fs.writeFile("chain.json",JSON.stringify(c),{
                  encoding:"utf-8"
              },(err:any)=>{
                  if(err) console.log(err)
                  else console.log("done")
              })
          }
          else{
              c=JSON.parse(JSON.stringify(fs.readFileSync("chain.json")))
              this.blocks=c.blocks
              this.addresses=c.addresses
          }
        })}).catch(console.log)
 }
 valid(){
  for(var i=1;i<this.blocks.length;i++){
   if(this.blocks[i-1].prevhash==this.blocks[i].hash)
    return true
   else 
    return false 
  }
 }
}

class Explorer {
  private chain:Chain
  constructor (chain){
    this.chain=chain;
  }
  getTrans(txhash){
    let blocks=this.chain.blocks;
  //  blocks=blocks.slice(1,blocks.length)
    return blocks.filter(b=>{
      b.trans.find(t=>{
        return (t.hash=txhash);
      })
    })
  }
  getBlock(blhash){
    let blocks=this.chain.blocks;
    blocks=blocks.slice(1,blocks.length);
    let d=blocks.find(b=>{
      return (b.hash==blhash);
    })
    return d
  }
  
}
const crypt=require("crypto")
let chain=new Chain()
let add1=chain.createAddress()
let add2=chain.createAddress()
let add3=chain.createAddress()
chain.createintial()
add1.transferTo(add2,0)
add3.transferTo(add1,600)
console.log(chain.pending_trans)
chain.blocks.map(b=>{
  
  console.log(b)
})
