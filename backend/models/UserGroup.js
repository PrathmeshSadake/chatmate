const UserGroup = sequelize.define("usergroup", {
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default UserGroup;
