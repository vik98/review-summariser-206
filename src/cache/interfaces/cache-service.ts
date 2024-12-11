import { CacheEntryInterface } from './cache-entry';

export interface CacheServiceInterface {
    /**
     *
     * @param key
     */
    get(key: string): Promise<CacheEntryInterface | undefined>;

    /**
     *
     * @param key
     * @param value
     * @param ttlSeconds
     */
    set(
        key: string,
        value: CacheEntryInterface,
        ttlSeconds: number,
    ): Promise<CacheEntryInterface>;

    delete(key: string): Promise<void>;
}
