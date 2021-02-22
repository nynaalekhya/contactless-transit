
        if(document.readyState == 'loading'){
            document.addEventListener('DOMContentLoaded', ready)
        }else{
                  ready()
        }
        function ready(){
            document.getElementsByTagName('button')[0].addEventListener("click",getPrice);
            
        }
        function getPrice(){
            var price=9;
            var ticket_id= document.getElementsByClassName('id')[0].innerHTML;
            var from= document.getElementsByClassName('from')[0].innerHTML;
            var to= document.getElementsByClassName('to')[0].innerHTML;
            var cost = parseFloat(document.getElementsByClassName('price')[0].innerHTML);
            console.log("cost is"+cost)
            console.log(ticket_id);
            var stripeHandler= StripeCheckout.configure({
                key: "pk_test_51Gy73eClLD4CzLriAVuTKhgJ7xwU5NPCR8AXhWurVBdrZ5QB8SkF5Bhw7wWTUgNmc48wkGUBjO2dXdVlaZ6EE9IZ00qVOfhYBn",
                locale:'en',
                token: function(token){
                    console.log(token.id);
                    fetch('/pay', {
                        method:'POST',
                        headers:{
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            token: token.id,
                            amount: price,
                            ticket_id:ticket_id,
                            from:from,
                            to:to,
                            cost:cost
                        }) 
                    })
                }
            });
            var element = document.getElementsByClassName('price')[0].innerHTML;
            price= parseFloat(element)*100;
            stripeHandler.open({
                amount: price
            })
        }