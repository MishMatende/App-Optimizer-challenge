import { AccountingData } from "./accounts";
import { PostData } from "./posts";

export namespace UserData {
    export interface ProfileData {
        name: string;
        cover_url: string;
        avatar_url: string;
        bio: string;
        website: string;
        facebook: string;
        twitter: string;
        instagram: string;
    }

    export interface IdentityDatum {
        identity_id: string,
        id: string,
        user_id: string,
        identity_data: {
          avatar_url: string,
          email: string,
          email_verified: boolean,
          full_name: string,
          iss: string,
          name: string,
          phone_verified: boolean,
          picture: string,
          provider_id: string,
          sub: string,
        },
        provider: string,
        last_sign_in_at: string,
        created_at: string,
        updated_at: string,
        email: string,
    }
    
    type MemberData = {
        member_id:string 
        avatar:string
        name:string
        bio:string
        reactions:{
            postid:string
        }[]
    }
     export interface MembersData {
        members: MemberData[]
        testimonials: Testimonial[]
        subscribers:string[]
    }

    type Testimonial = {
        member_id:string 
        avatar_url:string
        name:string 
        desc:string 
        quote:string
    }

    type billingData = {
        publish_date: string;

        billing_id: string;
    };
    export interface Posts {
        Drafts: Array<PostData.EnumeratedPost>;
        Pending: Array<PostData.EnumeratedPost & billingData>;
        Published: Array<PostData.Post & billingData>;
    }

    export interface GalleryDate {
        images: {
            resource_id: string;
            resource_url:string
            alt: string;
            description: string;
            size:number // KB
            type:string 
        }[];

        capacity: {
            total: number;
            used: number;
        };
    }

 
}
