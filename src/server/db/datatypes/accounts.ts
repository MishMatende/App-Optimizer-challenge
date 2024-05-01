

export namespace AccountingData {

    export type BillingPeriod = "monthly"|"quarterly"|"anually"
    export interface Options {
        _id:string
        name:string 
        description:string 
        amount:string 
        period: BillingPeriod
    }

    export interface BillingData {
        KRApin:string
        
        paymentHistory:{
            mpesaID:string
            time:string
            option_id:string
            date:string 
            period:string
        }[]
        total:number 
        pending:number
        mpesaNumber:number
        domain:{
            domain_date:string
            domain_countdown:number // hours
            hosting_date:string
            hosting_countdown:number //hours
            base_url:string
            email_url:string
            domain_:Options
            hosting_:Options
        }[]

        storage: {
            volume:number // GB
            
            billingOption: AccountingData.Options
        }
    }
}