import { ValueTransformer } from 'typeorm';
import { EncryptionService } from './encryption.service';

/**
 * TypeORM ValueTransformer for encrypting text columns.
 * Requires the EncryptionService to be injected manually or accessed via a singleton, 
 * because TypeORM transformers don't natively support NestJS DI.
 */
export class EncryptionTransformer implements ValueTransformer {
    private encryptionService: EncryptionService;

    constructor(encryptionService: EncryptionService) {
        this.encryptionService = encryptionService;
    }

    to(value: string | null): string | null {
        if (!value) {
            return value;
        }
        return this.encryptionService.encrypt(value);
    }

    from(value: string | null): string | null {
        if (!value) {
            return value;
        }
        try {
            return this.encryptionService.decrypt(value);
        } catch (e) {
            // Return original value if decryption fails (e.g., legacy plaintext data)
            // Note: this might mask real decryption errors in strict environments
            return value;
        }
    }
}
