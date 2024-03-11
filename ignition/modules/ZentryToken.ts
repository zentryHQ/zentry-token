import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const gfToken = '0xaaef88cea01475125522e117bfe45cf32044e238';
const owner = '0x9DE6DE21007312eeb6CD90500fFECafeC297B70D';

export default buildModule('ZentryToken', (m) => {
  const migrator = m.contract('Migrator', [gfToken]);

  const zentryToken = m.contract('ZentryToken', [migrator]);

  const setZentryToken = m.call(migrator, 'setZentryToken', [zentryToken], {
    after: [zentryToken],
  });

  m.call(migrator, 'transferOwnership', [owner], {
    after: [setZentryToken],
  });

  return { migrator, zentryToken };
});
