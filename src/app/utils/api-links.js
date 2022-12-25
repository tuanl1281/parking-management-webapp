const url = window.location.href;
export const isDev = url.indexOf('fr1day') > -1 || process.env.NODE_ENV === 'development';

const gatewayUrl = isDev
  ? 'https://api-parking.fr1day.tk/v1'
  : window?.env?.API_URL ?? 'https://api-parking.fr1day.tk/v1';

const apiLinks = {
  login: `${gatewayUrl}/Users/Login`,
  userInfo: `${gatewayUrl}/Users/Information`,
  getPermission: `${gatewayUrl}/Users/Permission`,
  checkCredential: `${gatewayUrl}/Users/ValidateCredential`,
  authentication: {
    user: {
      get: `${gatewayUrl}/Users`,
      create: `${gatewayUrl}/Users`,
      update: `${gatewayUrl}/Users`,
      delete: `${gatewayUrl}/Users`,
      getPermission: (userId) => `${gatewayUrl}/Users/${userId}/Permission`,
      changePassword: (userId) =>
        userId ? `${gatewayUrl}/Users/${userId}/ChangePassword` : `${gatewayUrl}/Users/ChangePassword`,
    },
    role: {
      get: `${gatewayUrl}/Roles`,
      create: `${gatewayUrl}/Roles`,
      update: `${gatewayUrl}/Roles`,
      delete: `${gatewayUrl}/Roles`,
      addUser: (roleId) => `${gatewayUrl}/Roles/${roleId}/AddUser`,
      removeUser: (roleId) => `${gatewayUrl}/Roles/${roleId}/RemoveUser`,
      addPermission: (roleId) => `${gatewayUrl}/Roles/${roleId}/AddPermission`,
      removePermission: (roleId) => `${gatewayUrl}/Roles/${roleId}/RemovePermission`,
      getPermission: (roleId) => `${gatewayUrl}/Roles/${roleId}/Permission`,
    },
    permission: {
      get: `${gatewayUrl}/Permissions`,
      create: `${gatewayUrl}/Permissions`,
      update: `${gatewayUrl}/Permissions`,
      delete: `${gatewayUrl}/Permissions`,
      addUser: (permissionId) => `${gatewayUrl}/Permissions/${permissionId}/AddUser`,
      removeUser: (permissionId) => `${gatewayUrl}/Permissions/${permissionId}/RemoveUser`,
      getRole: (permissionId) => `${gatewayUrl}/Roles/${permissionId}/`,
      addRole: (permissionId) => `${gatewayUrl}/Roles/${permissionId}/AddRole`,
      removeRole: (permissionId) => `${gatewayUrl}/Permissions/${permissionId}/RemoveRole`,
    },
  },
  customer: {
    get: (id) => `${gatewayUrl}/Customers${id ? `/${id}` : ''}`,
    create: `${gatewayUrl}/Customers`,
    update: (id) => `${gatewayUrl}/Customers/${id}`,
    delete: (id) => `${gatewayUrl}/Customers/${id}`,
    getVehicle: (id) => `${gatewayUrl}/Customers/${id}/Vehicle`,
    addVehicle: (id) => `${gatewayUrl}/Customers/${id}/AddVehicle`,
    removeVehicle: (id) => `${gatewayUrl}/Customers/${id}/RemoveVehicle`,
    getTransaction: (id) => `${gatewayUrl}/Customers/${id}/Transaction`,
    deposit: (id) => `${gatewayUrl}/Customers/${id}/Deposit`,
    withdraw: (id) => `${gatewayUrl}/Customers/${id}/Withdraw`,
  },
  vehicle: {
    get: (id) => `${gatewayUrl}/Vehicles${id ? `/${id}` : ''}`,
    create: `${gatewayUrl}/Vehicles`,
    update: (id) => `${gatewayUrl}/Vehicles/${id}`,
    delete: (id) => `${gatewayUrl}/Vehicles/${id}`,
    addCustomer: (id, customerId) => `${gatewayUrl}/Customers/${id}/AddCustomer/${customerId}`,
    removeCustomer: (id) => `${gatewayUrl}/Customers/${id}/RemoveCustomer`,
    getLog: (id) => `${gatewayUrl}/Vehicles/${id}/Log`,
    identify: `${gatewayUrl}/Vehicles/Identify`,
  },
  site: {
    get: (id) => `${gatewayUrl}/Sites${id ? `/${id}` : ''}`,
    create: `${gatewayUrl}/Sites`,
    update: (id) => `${gatewayUrl}/Sites/${id}`,
    delete: (id) => `${gatewayUrl}/Sites/${id}`,
    getCamera: (id) => `${gatewayUrl}/Sites/${id}/Camera`,
    addCamera: (id) => `${gatewayUrl}/Sites/${id}/AddCamera`,
    removeCamera: (id) => `${gatewayUrl}/Sites/${id}/RemoveCamera`,
  },
  camera: {
    get: (id) => `${gatewayUrl}/Cameras${id ? `/${id}` : ''}`,
    create: `${gatewayUrl}/Cameras`,
    update: (id) => `${gatewayUrl}/Cameras/${id}`,
    delete: (id) => `${gatewayUrl}/Cameras/${id}`,
  },
  statistic: {
    getVehicleLog: `${gatewayUrl}/Statistics/Vehicle/Log`,
  },
};

export default apiLinks;
