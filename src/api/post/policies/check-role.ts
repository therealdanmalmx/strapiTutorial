/**
 * check-role policy
 */

export default (policyContext, config, { strapi }) => {
  const { userRole } = config;
  const isEligable =
    policyContext.state.user && policyContext.state.user.role.name === userRole;

  if (isEligable) {
    return true;
  }

  return false;
};
