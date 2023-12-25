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
  get hash(){return this.hash;}
  setblchash(hash){this.hash=hash;}
  
}

class Chain{

 private maxTrans=2 
 public blocks=[]
  constructor(){
      console.log(this.maxTrans)
  }
  add(b){this.blocks.push(b);}
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
       new Block([],hash));
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
   this.getlast().ghash()
   trans.setblchash(this.getlast().hash)
   
   
    
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
chain.createintial()
chain.addtrans(chain.getlast(),"7","8",
100)
chain.addtrans(chain.getlast(),"7","9",1000)
chain.addtrans(chain.getlast(),"9","8",
300)
chain.addtrans(chain.getlast(),"9","19",200)
chain.addtrans(chain.getlast(),
"5","8",500)

chain.blocks.map(b=>{
  
  console.log(b)
})
