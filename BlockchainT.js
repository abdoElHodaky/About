class Block{
  type=""
  trans=[]
  prevhash=""
  hash=""
  timestamp=""
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
    let b=new Buffer.from(
      this.prevhash+
      JSON.stringify(this.trans)+
      JSON.stringify(this.timestamp))
      this.hash=crypt.
      createHash("sha256")
      .update(b).digest("hex")
    
    
  }
}


class Trans{
  from=""
  to=""
  amount=0
  hash="" 
  timestamp=""
  constructor(){
    this.from=arguments[0]
    this.to=arguments[1]
    this.amount=arguments[2]
    this.timestamp=Date.now()
    this.ghash()
  }
  ghash(){
      let b=new Buffer.from(
      JSON.stringify(this.timestamp))
      this.hash=crypt.
      createHash("sha256")
      .update(b).digest("hex")
    
  }
  
}

class Chain{
  
  blocks=[]
  add(b){this.blocks.push(b)}
  getlast(){
    return this.blocks[this.blocks.length-1]
   }
   createintial()
   {
    let block=new Block([])
     block.type="intial"
     this.add(block)
   }
   
   contains(hash){
    let b=this.blocks.filter(b=>b.prevhash==hash)
     
   }
   
  addtrans(block,from="",to="", amount=0){
    block=this.getlast()
    if (block.type!="intial" && block.trans.length==0){
        block=new Block(block.trans,block.hash)
        this.add(block)
      
    block.addtrans(new Trans(from,to, amount ))
      
        
   
      
  }
  else{
    let b=new Block([],block.hash)
    b.addtrans(new Trans(from,to, amount))
    this.add(b)
   }
   //block=this.getlast()
   //block.addtrans(new Trans(from,to, amount ))
  // this.getlast().addtrans(new Trans(from,to, amount))
   
    
  }
}
const crypt=require("crypto")
chain=new Chain()
chain.createintial()
chain.addtrans(chain.getlast(),from="7",to="8",
amount=100)
chain.addtrans(chain.getlast(),from="7",to="9",amount=1000)
chain.addtrans(chain.getlast(),from="9",to="8",
amount=300)
chain.addtrans(chain.getlast(),from="9",to="19",amount=200)
chain.addtrans(chain.getlast(),from="5",to="8", amount=500)
chain.blocks.map(b=>{
  
  console.log(b)
})