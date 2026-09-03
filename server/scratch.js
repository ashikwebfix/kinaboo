const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  define: {
    hooks: {
      beforeDefine: (attributes, options) => {
         // console.log("Before Define:", options);
      },
      afterDefine: (model) => {
         // Sequelize automatically pluralizes table name if freezeTableName is not true.
         // Let's just force the tableName to be lowercase.
         model.options.tableName = model.options.tableName ? model.options.tableName.toLowerCase() : model.tableName.toLowerCase();
         model.tableName = model.options.tableName;
      }
    }
  }
});
const User = sequelize.define('User', { name: DataTypes.STRING });
const Category = sequelize.define('Category', { name: DataTypes.STRING });
console.log(User.tableName);
console.log(Category.tableName);
