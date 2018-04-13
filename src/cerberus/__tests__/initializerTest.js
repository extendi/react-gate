import CerberusAuth from '../../cerberus';


describe('Cerberus Initializer', () => {
  const normalCerberusConfig = {
    roles: ['admin', 'basic'],
    loginSelector: () => true,
    roleSelector: () => 'admin',
    permissions: [
      {
        name: 'Test permission',
        predicates: [() => true],
      },
      {
        name: 'Test permission2',
        predicates: [() => true],
      },
      {
        name: 'Test permission2',
        predicates: [() => true],
      },
    ],
  };

  const withoutLoginSelectorConfig = {
    roles: ['admin', 'basic'],
  };

  it('Should throw an error if i request an HOC with unrecognized role', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);

    expect(() => {
      cerberusInstance.getHOCForRole('normal');
    }).toThrow();
  });

  it('Should not throw an error if i request an HOC with recognized role', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const hoc = cerberusInstance.getHOCForRole('admin');
    expect(typeof hoc).toEqual('function');
  });

  it('Should throw an error if don\'t specify a login selector but i request a login HOC', () => {
    const cerberusInstance = new CerberusAuth(withoutLoginSelectorConfig);
    expect(() => {
      cerberusInstance.getHOCForLogin();
    }).toThrow();
  });

  it('Should not throw an error I request and hoc login if I specify a login selector', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const hoc = cerberusInstance.getHOCForLogin();
    expect(typeof hoc).toEqual('function');
  });

  it('Should throw an error if I ask for a permission that does not exists ', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    expect(() => {
      cerberusInstance.getHOCForRole('admin', 'permission3');
    }).toThrow();
  });

  it('Should not throw an error if I ask for a permission that does exists ', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    const hoc = cerberusInstance.getHOCForRole('admin', 'Test permission');
    expect(typeof hoc).toEqual('function');
  });

  it('Should throw an error if I ask for a permission that is declared two or more times with the same name ', () => {
    const cerberusInstance = new CerberusAuth(normalCerberusConfig);
    expect(() => {
      cerberusInstance.getHOCForRole('admin', 'Test permission2');
    }).toThrow();
  });
});
