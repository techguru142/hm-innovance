let arr = [
        {"name":"sandeep",
        "email":"sandeep@mail.com",
        "password":"Sandeep@123",
        "message":"I am intrested"
        },
        {"name":"Satish",
        "email":"Satish@mail.com",
        "password":"Satish@123",
        "message":"I am intrested"
        },
        {"name":"Saurav",
        "email":"Saurav@mail.com",
        "password":"Saurav@123",
        "message":"I am intrested"
        },
        {"name":"Hanuman",
        "email":"Hanuman@mail.com",
        "password":"Hanuman@123",
        "message":"I am intrested"
        },
        {"name":"Suraj",
        "email":"Suraj@mail.com",
        "password":"Suraj@123",
        "message":"I am intrested"
        },
        {"name":"Sumit",
        "email":"Sumit@mail.com",
        "password":"Sumit@123",
        "message":"I am intrested"
        },
        {"name":"Suman",
        "email":"Suman@mail.com",
        "password":"Suman@123",
        "message":"I am intrested"
        },
        {"name":"Raju",
        "email":"Raju@mail.com",
        "password":"Raju@123",
        "message":"I am intrested"
        }
        ]
        var list = []
 arr.map((ele)=>{
            let obj = {
                name:ele.name,
                email:ele.name,
                message:ele.message
            }
            list.push(obj)
            
        })
console.log(list)