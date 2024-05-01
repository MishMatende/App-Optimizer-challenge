export namespace PostData {
    export type Metadata = {
        title: string;
        subtitle: string;
        language: string;
        publish_date: string;
        cover_image: string;
        description: string;
        authors: string[];
        keywords: string[];
    }

   export type Section =
        | {
              title?: string;
              p: string;
          }
        | {
              img: string;
              alt?: string;
              desc?: string;
          }
        | {
            link:string,
            platform:'Fb'|'Ig'|'Tw'
        };

    export type Post = {
        id: string;
        meta: Metadata;
        body: Section[];
        reactions: Interactions;
    };

    export type EnumeratedPost  = Omit<Post,"reactions"> & {reactions: EnumaratedInteractions}

    interface MemberType {
        _id: string;
        _name: string;
        _avatar_url: string;
    }

   export  interface CommentType {
        //max-depth:2
        member_id: MemberType;
        comment_id: string;
        parent_id?: string;
        comment: string;
    }

    export type BackLinkType = { url: string; count: number }
    export interface Interactions {
        likes: {
            member_ids: string[];
        };
        comments: CommentType[];
        backlinks: BackLinkType[];
        views: number;
    }

    export type EnumaratedInteractions = {
        likes: number;
        comments: number;
        backlinks: number;
        views: number;
    };
}
