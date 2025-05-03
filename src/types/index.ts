import type { ModuleOptions } from '../module'

export interface RuntimeConfig {
  public: {
    securityKeyShared: NonNullable<ModuleOptions['aes']>['keyShared']
  }
}
