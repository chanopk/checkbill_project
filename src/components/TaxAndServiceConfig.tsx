import type { TaxAndService } from '../types';
import { Receipt } from 'lucide-react';

interface Props {
    taxAndService: TaxAndService;
    onUpdate: (field: keyof TaxAndService, value: number) => void;
}

export function TaxAndServiceConfig({ taxAndService, onUpdate }: Props) {
    return (
        <div className="glass-panel">
            <h2 className="title title-primary">
                <Receipt size={24} />
                ภาษีและบริการ (Tax & Service)
            </h2>

            <div className="tax-config-row">
                <div className="flex-1">
                    <label className="label-text">
                        Service Charge (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxAndService.serviceChargePercentage}
                        onChange={(e) => onUpdate('serviceChargePercentage', parseFloat(e.target.value) || 0)}
                        className="input-base"
                    />
                </div>

                <div className="flex-1">
                    <label className="label-text">
                        VAT (%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxAndService.vatPercentage}
                        onChange={(e) => onUpdate('vatPercentage', parseFloat(e.target.value) || 0)}
                        className="input-base"
                    />
                </div>
            </div>
        </div>
    );
}
