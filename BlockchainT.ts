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
  static updatetransSblchash(block){
   block.trans.map(t=>t.setblchash(block.hash))    
  }
}


class Trans{
  private from=""
  private to=""
  private amount=0
  private hash="" 
  private timestamp=0
  private blchash=""
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
  setblchash(hash){this.blchash=hash;}
  
}

class Chain{
 private fee=0.00001
 private addresses=[]
 static address=1
 private maxTrans=2 
 public blocks=[]
  constructor(){
      console.log(this.maxTrans)
  }
  add(b){this.blocks.push(b);}
  checkAddress(address){
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
     this.add(block);
   }
   createblock(trans,hash){
     this.add(
       new Block(trans,hash));
   }
   
   contains(hash){
    let b=this.blocks.filter(b=>b.prevhash==hash);
     
   }
   
  addtrans(block,from="",to="", amount=0){
    let trans=new Trans(from,to,amount);
    block=this.getlast();
    if (block.type!="initial"){
       if(block.trans.length==this.maxTrans)
        {
          this.createblock([],block.hash);
          
        }
        
        //this.getlast().addtrans(trans)
  }
  if(block.type=="initial"){
    this.createblock([],block.hash);
   }
   
   this.getlast().addtrans(trans);
   Block.updatetransSblchash(this.getlast())
  }
 createAddress(user:string=""){
     
    let address=new Address(Chain.address.toString())
    address.setTransfer(this)
    this.addresses.push(address.address)
    Chain.address+=1
    return address 
 }

 syncT(){
      let c=this
      let _fs
      import("fs").then(fs=>_fs=fs).catch(console.log)
      _fs.exists("chain.json",exists=>{
          if(exists==false){
              _fs.writeFile("chain.json",JSON.stringify(c),{
                  encoding:"uft-8"
              },(err)=>{
                  if(err) console.log(err)
                  else console.log("done")
              })
          }
          else{
              c=JSON.parse(_fs.readFileSync("chain.json"))
              this=c
          }
      })
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
console.log(add3,add1)
chain.blocks.map(b=>{
  
  console.log(b)
})
