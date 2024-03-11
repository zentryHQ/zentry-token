import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const gfToken = '0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e';
const owner = '';

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
