import { IResolvers } from 'graphql-tools';
import db from "../db";
import {AuthData} from "../struct/user";
import {APIError, APIResult} from "../helpers";

function resolveType(expected: String) {
  return {
    __resolveType(obj: any) {
      return obj.error ? "APIError" : expected;
    }
  }
}

const resolvers: IResolvers = {
  APIResponse: resolveType("APIResult"),
  LoginInfo: resolveType("Login"),
  UserInfo: resolveType("User"),
  SoundInfo: resolveType("Sound"),
  VideoInfo: resolveType("Video"),
  WatchInfo: resolveType("WatchData"),
  CommentInfo: resolveType("Comment"),
  Query: {
    async user(_: void, args: any) {
      return db.getUser(args.name);
    },
    async sound(_: void, args: any) {
      return db.getSound(args.id);
    },
    async video(_: void, args: any, auth: AuthData) {
      return db.getVideo(auth, args.id);
    },
    async comment(_: void, args: any, auth: AuthData) {
      return db.getComment(auth, args.id);
    },
    async me(_: void, args: any, auth: AuthData) {
      return auth.valid ? db.getUser(auth.username as string) : new APIError("Invalid Login");
    },
    async videos(_: void, args: any, auth: AuthData) {
      return db.getVideos(auth, args.count);
    }
  },
  Mutation: {
    async login(_: void, args: any) {
      return db.login(args.username, args.password, args.device);
    },
    async createUser(_: void, args: any) {
      return db.createUser(args.name, args.password, args.displayName, args.profilePicURL);
    },
    async createSound(_: void, args: any, auth: AuthData) {
      return db.createSound(auth, args.desc);
    },
    async createVideo(_: void, args: any, auth: AuthData) {
      return db.createVideo(auth, args.soundId, args.src, args.desc);
    },
    async watchVideo(_: void, args: any, auth: AuthData) {
      return db.watchVideo(auth, args.videoId, args.seconds);
    },
    async likeVideo(_: void, args: any, auth: AuthData) {
      return db.likeVideo(auth, args.videoId, args.remove);
    },
    async addComment(_: void, args: any, auth: AuthData) {
      return db.addComment(auth, args.videoId, args.body);
    }
  }
};

export default resolvers;