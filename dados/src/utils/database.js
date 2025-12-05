import fs from 'fs';
import path from 'path';
import { paths } from './paths.js';

/**
 * Sistema de banco de dados JSON para o Hinokami Bot
 * Gerencia persistência de dados de grupos, usuários, economia, etc.
 */

export class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.cache = new Map();
    this.ensureFile();
  }

  ensureFile() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (!fs.existsSync(this.dbPath)) {
        fs.writeFileSync(this.dbPath, JSON.stringify({}, null, 2));
      }
    } catch (error) {
      console.error(`Erro ao criar arquivo de banco de dados: ${error.message}`);
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erro ao ler banco de dados: ${error.message}`);
      return {};
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      this.cache.clear();
    } catch (error) {
      console.error(`Erro ao escrever no banco de dados: ${error.message}`);
    }
  }

  get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = this.read();
    const value = data[key];
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    const data = this.read();
    data[key] = value;
    this.write(data);
  }

  delete(key) {
    const data = this.read();
    delete data[key];
    this.write(data);
  }

  has(key) {
    const data = this.read();
    return key in data;
  }

  backup() {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const backupPath = `${this.dbPath}.backup-${timestamp}`;
      fs.copyFileSync(this.dbPath, backupPath);
      return backupPath;
    } catch (error) {
      console.error(`Erro ao fazer backup: ${error.message}`);
      return null;
    }
  }
}

/**
 * Gerenciador de grupos
 */
export class GroupDatabase extends Database {
  constructor() {
    super(path.join(paths.database, 'grupos.json'));
  }

  getGroup(groupId) {
    return this.get(groupId) || this.createGroup(groupId);
  }

  createGroup(groupId) {
    const groupData = {
      id: groupId,
      settings: {
        antilink: false,
        antispam: true,
        antiporn: false,
        welcome: true,
        mute: false,
        levelSystem: true
      },
      members: {},
      mods: [],
      warnings: {},
      stats: {
        messagesCount: 0,
        commandsUsed: 0
      },
      customCommands: {},
      createdAt: Date.now()
    };
    this.set(groupId, groupData);
    return groupData;
  }

  updateSettings(groupId, settings) {
    const group = this.getGroup(groupId);
    group.settings = { ...group.settings, ...settings };
    this.set(groupId, group);
  }

  addMod(groupId, userId) {
    const group = this.getGroup(groupId);
    if (!group.mods.includes(userId)) {
      group.mods.push(userId);
      this.set(groupId, group);
    }
  }

  removeMod(groupId, userId) {
    const group = this.getGroup(groupId);
    group.mods = group.mods.filter(id => id !== userId);
    this.set(groupId, group);
  }

  isMod(groupId, userId) {
    const group = this.getGroup(groupId);
    return group.mods.includes(userId);
  }

  addWarning(groupId, userId) {
    const group = this.getGroup(groupId);
    group.warnings[userId] = (group.warnings[userId] || 0) + 1;
    this.set(groupId, group);
    return group.warnings[userId];
  }

  clearWarnings(groupId, userId) {
    const group = this.getGroup(groupId);
    delete group.warnings[userId];
    this.set(groupId, group);
  }

  getMemberData(groupId, userId) {
    const group = this.getGroup(groupId);
    return group.members[userId] || {
      xp: 0,
      level: 1,
      money: 0,
      messageCount: 0
    };
  }

  updateMemberData(groupId, userId, data) {
    const group = this.getGroup(groupId);
    group.members[userId] = { ...group.members[userId], ...data };
    this.set(groupId, group);
  }

  addXP(groupId, userId, amount) {
    const memberData = this.getMemberData(groupId, userId);
    memberData.xp += amount;
    
    // Sistema de level
    const newLevel = Math.floor(Math.sqrt(memberData.xp / 100)) + 1;
    const leveledUp = newLevel > memberData.level;
    memberData.level = newLevel;
    
    this.updateMemberData(groupId, userId, memberData);
    return { leveledUp, level: newLevel };
  }
}

/**
 * Gerenciador de usuários/donos
 */
export class UserDatabase extends Database {
  constructor() {
    super(path.join(paths.database, 'usuarios.json'));
  }

  getUser(userId) {
    return this.get(userId) || this.createUser(userId);
  }

  createUser(userId) {
    const userData = {
      id: userId,
      isPremium: false,
      isBlacklisted: false,
      commandCount: 0,
      lastCommand: 0,
      cooldowns: {},
      createdAt: Date.now()
    };
    this.set(userId, userData);
    return userData;
  }

  setCooldown(userId, command, duration = 3000) {
    const user = this.getUser(userId);
    user.cooldowns[command] = Date.now() + duration;
    this.set(userId, user);
  }

  checkCooldown(userId, command) {
    const user = this.getUser(userId);
    const cooldownEnd = user.cooldowns[command] || 0;
    return Date.now() < cooldownEnd;
  }

  getCooldownTime(userId, command) {
    const user = this.getUser(userId);
    const cooldownEnd = user.cooldowns[command] || 0;
    return Math.max(0, cooldownEnd - Date.now());
  }
}

/**
 * Gerenciador de configuração do bot
 */
export class ConfigDatabase extends Database {
  constructor() {
    super(path.join(paths.database, 'config_db.json'));
  }

  getOwners() {
    return this.get('owners') || [];
  }

  addOwner(userId) {
    const owners = this.getOwners();
    if (!owners.includes(userId)) {
      owners.push(userId);
      this.set('owners', owners);
    }
  }

  removeOwner(userId) {
    const owners = this.getOwners();
    this.set('owners', owners.filter(id => id !== userId));
  }

  isOwner(userId) {
    return this.getOwners().includes(userId);
  }

  getBlacklist() {
    return this.get('blacklist') || [];
  }

  addToBlacklist(userId) {
    const blacklist = this.getBlacklist();
    if (!blacklist.includes(userId)) {
      blacklist.push(userId);
      this.set('blacklist', blacklist);
    }
  }

  removeFromBlacklist(userId) {
    const blacklist = this.getBlacklist();
    this.set('blacklist', blacklist.filter(id => id !== userId));
  }

  isBlacklisted(userId) {
    return this.getBlacklist().includes(userId);
  }
}

// Instâncias singleton
export const groupDB = new GroupDatabase();
export const userDB = new UserDatabase();
export const configDB = new ConfigDatabase();

export default { Database, GroupDatabase, UserDatabase, ConfigDatabase, groupDB, userDB, configDB };
