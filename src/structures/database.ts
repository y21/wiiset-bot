import { Pool } from 'pg';

export class Database {
    private pool: Pool;
    
    constructor() {
        this.pool = new Pool();
    }
}