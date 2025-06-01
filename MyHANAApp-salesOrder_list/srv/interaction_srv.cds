using app.interactions from '../db/interactions';
using {sap} from '@sap/cds-common-content';

service CatalogService {

    // @odata.draft.enabled: true
    entity Interactions_SalesOrders as projection on interactions.SalesOrders;
    
}