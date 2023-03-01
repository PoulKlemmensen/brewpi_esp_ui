import { defineStore } from 'pinia';
import { mande } from 'mande'
import { genCSRFOptions } from './CSRF';

export const useExtendedSettingsStore = defineStore("ExtendedSettingsStore", {
    state: () => {
        return {
            hasExtendedSettings: false,
            extendedSettingsError: false,
            extendedSettingsUpdateError: false,

            glycol: false,
            lowdelay: false,
            invertTFT: false,
        };
    },
    actions: {
        async getExtendedSettings() {
            try {
                const remote_api = mande("/api/extended/", genCSRFOptions());
                const response = await remote_api.get();
                if (response) {
                    this.hasExtendedSettings = true;
                    this.extendedSettingsError = false;
                    this.glycol = response.glycol;
                    this.lowdelay = response.lowdelay;
                    this.invertTFT = response.invertTFT;
                } else {
                    await this.clearExtendedSettings();
                    this.extendedSettingsError = true;
                }
            } catch (error) {
                await this.clearExtendedSettings();
                this.extendedSettingsError = true;
            }
        },
        async clearExtendedSettings() {
            this.hasExtendedSettings = false;
            this.glycol = false;
            this.lowdelay = false;
            this.invertTFT = false;
        },
        async setExtendedSettings(glycol, lowdelay, invertTFT) {
            try {
                const remote_api = mande("/api/extended/", genCSRFOptions());
                const response = await remote_api.put({
                    glycol: glycol,  // Boolean
                    lowdelay: lowdelay,  // Boolean
                    invertTFT: invertTFT, // Boolean
                });
                if (response && response.message) {
                    // TODO - Check response.message
                    await this.getExtendedSettings();
                    this.extendedSettingsUpdateError = false;
                } else {
                    await this.clearExtendedSettings();
                    this.extendedSettingsUpdateError = true;
                }
            } catch (error) {
                await this.clearExtendedSettings();
                this.extendedSettingsUpdateError = true;
            }
        }
    },
});