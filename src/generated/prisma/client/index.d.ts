
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Entity
 * 
 */
export type Entity = $Result.DefaultSelection<Prisma.$EntityPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model Scene
 * 
 */
export type Scene = $Result.DefaultSelection<Prisma.$ScenePayload>
/**
 * Model SceneEntity
 * 
 */
export type SceneEntity = $Result.DefaultSelection<Prisma.$SceneEntityPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const EntityType: {
  CHARACTER: 'CHARACTER',
  LOCATION: 'LOCATION',
  ITEM: 'ITEM',
  EVENT: 'EVENT',
  CONCEPT: 'CONCEPT'
};

export type EntityType = (typeof EntityType)[keyof typeof EntityType]

}

export type EntityType = $Enums.EntityType

export const EntityType: typeof $Enums.EntityType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Projects
 * const projects = await prisma.project.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Projects
   * const projects = await prisma.project.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.entity`: Exposes CRUD operations for the **Entity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Entities
    * const entities = await prisma.entity.findMany()
    * ```
    */
  get entity(): Prisma.EntityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scene`: Exposes CRUD operations for the **Scene** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Scenes
    * const scenes = await prisma.scene.findMany()
    * ```
    */
  get scene(): Prisma.SceneDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sceneEntity`: Exposes CRUD operations for the **SceneEntity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SceneEntities
    * const sceneEntities = await prisma.sceneEntity.findMany()
    * ```
    */
  get sceneEntity(): Prisma.SceneEntityDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Project: 'Project',
    Entity: 'Entity',
    Document: 'Document',
    Scene: 'Scene',
    SceneEntity: 'SceneEntity'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "project" | "entity" | "document" | "scene" | "sceneEntity"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Entity: {
        payload: Prisma.$EntityPayload<ExtArgs>
        fields: Prisma.EntityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EntityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EntityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>
          }
          findFirst: {
            args: Prisma.EntityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EntityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>
          }
          findMany: {
            args: Prisma.EntityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>[]
          }
          create: {
            args: Prisma.EntityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>
          }
          createMany: {
            args: Prisma.EntityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EntityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>[]
          }
          delete: {
            args: Prisma.EntityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>
          }
          update: {
            args: Prisma.EntityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>
          }
          deleteMany: {
            args: Prisma.EntityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EntityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EntityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>[]
          }
          upsert: {
            args: Prisma.EntityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EntityPayload>
          }
          aggregate: {
            args: Prisma.EntityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEntity>
          }
          groupBy: {
            args: Prisma.EntityGroupByArgs<ExtArgs>
            result: $Utils.Optional<EntityGroupByOutputType>[]
          }
          count: {
            args: Prisma.EntityCountArgs<ExtArgs>
            result: $Utils.Optional<EntityCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      Scene: {
        payload: Prisma.$ScenePayload<ExtArgs>
        fields: Prisma.SceneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SceneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SceneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>
          }
          findFirst: {
            args: Prisma.SceneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SceneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>
          }
          findMany: {
            args: Prisma.SceneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>[]
          }
          create: {
            args: Prisma.SceneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>
          }
          createMany: {
            args: Prisma.SceneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SceneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>[]
          }
          delete: {
            args: Prisma.SceneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>
          }
          update: {
            args: Prisma.SceneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>
          }
          deleteMany: {
            args: Prisma.SceneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SceneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SceneUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>[]
          }
          upsert: {
            args: Prisma.SceneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScenePayload>
          }
          aggregate: {
            args: Prisma.SceneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScene>
          }
          groupBy: {
            args: Prisma.SceneGroupByArgs<ExtArgs>
            result: $Utils.Optional<SceneGroupByOutputType>[]
          }
          count: {
            args: Prisma.SceneCountArgs<ExtArgs>
            result: $Utils.Optional<SceneCountAggregateOutputType> | number
          }
        }
      }
      SceneEntity: {
        payload: Prisma.$SceneEntityPayload<ExtArgs>
        fields: Prisma.SceneEntityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SceneEntityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SceneEntityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>
          }
          findFirst: {
            args: Prisma.SceneEntityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SceneEntityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>
          }
          findMany: {
            args: Prisma.SceneEntityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>[]
          }
          create: {
            args: Prisma.SceneEntityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>
          }
          createMany: {
            args: Prisma.SceneEntityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SceneEntityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>[]
          }
          delete: {
            args: Prisma.SceneEntityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>
          }
          update: {
            args: Prisma.SceneEntityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>
          }
          deleteMany: {
            args: Prisma.SceneEntityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SceneEntityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SceneEntityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>[]
          }
          upsert: {
            args: Prisma.SceneEntityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SceneEntityPayload>
          }
          aggregate: {
            args: Prisma.SceneEntityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSceneEntity>
          }
          groupBy: {
            args: Prisma.SceneEntityGroupByArgs<ExtArgs>
            result: $Utils.Optional<SceneEntityGroupByOutputType>[]
          }
          count: {
            args: Prisma.SceneEntityCountArgs<ExtArgs>
            result: $Utils.Optional<SceneEntityCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    project?: ProjectOmit
    entity?: EntityOmit
    document?: DocumentOmit
    scene?: SceneOmit
    sceneEntity?: SceneEntityOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    documents: number
    entities: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | ProjectCountOutputTypeCountDocumentsArgs
    entities?: boolean | ProjectCountOutputTypeCountEntitiesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountEntitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntityWhereInput
  }


  /**
   * Count Type EntityCountOutputType
   */

  export type EntityCountOutputType = {
    scenes: number
  }

  export type EntityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenes?: boolean | EntityCountOutputTypeCountScenesArgs
  }

  // Custom InputTypes
  /**
   * EntityCountOutputType without action
   */
  export type EntityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EntityCountOutputType
     */
    select?: EntityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EntityCountOutputType without action
   */
  export type EntityCountOutputTypeCountScenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SceneEntityWhereInput
  }


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    scenes: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scenes?: boolean | DocumentCountOutputTypeCountScenesArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountScenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SceneWhereInput
  }


  /**
   * Count Type SceneCountOutputType
   */

  export type SceneCountOutputType = {
    entities: number
  }

  export type SceneCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entities?: boolean | SceneCountOutputTypeCountEntitiesArgs
  }

  // Custom InputTypes
  /**
   * SceneCountOutputType without action
   */
  export type SceneCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneCountOutputType
     */
    select?: SceneCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SceneCountOutputType without action
   */
  export type SceneCountOutputTypeCountEntitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SceneEntityWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    title: number
    description: number
    settings: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    settings?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    title: string
    description: string | null
    settings: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    documents?: boolean | Project$documentsArgs<ExtArgs>
    entities?: boolean | Project$entitiesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "settings" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | Project$documentsArgs<ExtArgs>
    entities?: boolean | Project$entitiesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      entities: Prisma.$EntityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      settings: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    documents<T extends Project$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    entities<T extends Project$entitiesArgs<ExtArgs> = {}>(args?: Subset<T, Project$entitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly title: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly settings: FieldRef<"Project", 'Json'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.documents
   */
  export type Project$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Project.entities
   */
  export type Project$entitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    where?: EntityWhereInput
    orderBy?: EntityOrderByWithRelationInput | EntityOrderByWithRelationInput[]
    cursor?: EntityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EntityScalarFieldEnum | EntityScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Entity
   */

  export type AggregateEntity = {
    _count: EntityCountAggregateOutputType | null
    _min: EntityMinAggregateOutputType | null
    _max: EntityMaxAggregateOutputType | null
  }

  export type EntityMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    type: $Enums.EntityType | null
    name: string | null
    description: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EntityMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    type: $Enums.EntityType | null
    name: string | null
    description: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EntityCountAggregateOutputType = {
    id: number
    projectId: number
    type: number
    name: number
    description: number
    attributes: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EntityMinAggregateInputType = {
    id?: true
    projectId?: true
    type?: true
    name?: true
    description?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EntityMaxAggregateInputType = {
    id?: true
    projectId?: true
    type?: true
    name?: true
    description?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EntityCountAggregateInputType = {
    id?: true
    projectId?: true
    type?: true
    name?: true
    description?: true
    attributes?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EntityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Entity to aggregate.
     */
    where?: EntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entities to fetch.
     */
    orderBy?: EntityOrderByWithRelationInput | EntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Entities
    **/
    _count?: true | EntityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EntityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EntityMaxAggregateInputType
  }

  export type GetEntityAggregateType<T extends EntityAggregateArgs> = {
        [P in keyof T & keyof AggregateEntity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEntity[P]>
      : GetScalarType<T[P], AggregateEntity[P]>
  }




  export type EntityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EntityWhereInput
    orderBy?: EntityOrderByWithAggregationInput | EntityOrderByWithAggregationInput[]
    by: EntityScalarFieldEnum[] | EntityScalarFieldEnum
    having?: EntityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EntityCountAggregateInputType | true
    _min?: EntityMinAggregateInputType
    _max?: EntityMaxAggregateInputType
  }

  export type EntityGroupByOutputType = {
    id: string
    projectId: string
    type: $Enums.EntityType
    name: string
    description: string | null
    attributes: JsonValue
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: EntityCountAggregateOutputType | null
    _min: EntityMinAggregateOutputType | null
    _max: EntityMaxAggregateOutputType | null
  }

  type GetEntityGroupByPayload<T extends EntityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EntityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EntityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EntityGroupByOutputType[P]>
            : GetScalarType<T[P], EntityGroupByOutputType[P]>
        }
      >
    >


  export type EntitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    attributes?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    scenes?: boolean | Entity$scenesArgs<ExtArgs>
    _count?: boolean | EntityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entity"]>

  export type EntitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    attributes?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entity"]>

  export type EntitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    attributes?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["entity"]>

  export type EntitySelectScalar = {
    id?: boolean
    projectId?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    attributes?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EntityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "type" | "name" | "description" | "attributes" | "imageUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["entity"]>
  export type EntityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    scenes?: boolean | Entity$scenesArgs<ExtArgs>
    _count?: boolean | EntityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EntityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type EntityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $EntityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Entity"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      scenes: Prisma.$SceneEntityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      type: $Enums.EntityType
      name: string
      description: string | null
      attributes: Prisma.JsonValue
      imageUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["entity"]>
    composites: {}
  }

  type EntityGetPayload<S extends boolean | null | undefined | EntityDefaultArgs> = $Result.GetResult<Prisma.$EntityPayload, S>

  type EntityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EntityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EntityCountAggregateInputType | true
    }

  export interface EntityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Entity'], meta: { name: 'Entity' } }
    /**
     * Find zero or one Entity that matches the filter.
     * @param {EntityFindUniqueArgs} args - Arguments to find a Entity
     * @example
     * // Get one Entity
     * const entity = await prisma.entity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EntityFindUniqueArgs>(args: SelectSubset<T, EntityFindUniqueArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Entity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EntityFindUniqueOrThrowArgs} args - Arguments to find a Entity
     * @example
     * // Get one Entity
     * const entity = await prisma.entity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EntityFindUniqueOrThrowArgs>(args: SelectSubset<T, EntityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Entity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityFindFirstArgs} args - Arguments to find a Entity
     * @example
     * // Get one Entity
     * const entity = await prisma.entity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EntityFindFirstArgs>(args?: SelectSubset<T, EntityFindFirstArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Entity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityFindFirstOrThrowArgs} args - Arguments to find a Entity
     * @example
     * // Get one Entity
     * const entity = await prisma.entity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EntityFindFirstOrThrowArgs>(args?: SelectSubset<T, EntityFindFirstOrThrowArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Entities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Entities
     * const entities = await prisma.entity.findMany()
     * 
     * // Get first 10 Entities
     * const entities = await prisma.entity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const entityWithIdOnly = await prisma.entity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EntityFindManyArgs>(args?: SelectSubset<T, EntityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Entity.
     * @param {EntityCreateArgs} args - Arguments to create a Entity.
     * @example
     * // Create one Entity
     * const Entity = await prisma.entity.create({
     *   data: {
     *     // ... data to create a Entity
     *   }
     * })
     * 
     */
    create<T extends EntityCreateArgs>(args: SelectSubset<T, EntityCreateArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Entities.
     * @param {EntityCreateManyArgs} args - Arguments to create many Entities.
     * @example
     * // Create many Entities
     * const entity = await prisma.entity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EntityCreateManyArgs>(args?: SelectSubset<T, EntityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Entities and returns the data saved in the database.
     * @param {EntityCreateManyAndReturnArgs} args - Arguments to create many Entities.
     * @example
     * // Create many Entities
     * const entity = await prisma.entity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Entities and only return the `id`
     * const entityWithIdOnly = await prisma.entity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EntityCreateManyAndReturnArgs>(args?: SelectSubset<T, EntityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Entity.
     * @param {EntityDeleteArgs} args - Arguments to delete one Entity.
     * @example
     * // Delete one Entity
     * const Entity = await prisma.entity.delete({
     *   where: {
     *     // ... filter to delete one Entity
     *   }
     * })
     * 
     */
    delete<T extends EntityDeleteArgs>(args: SelectSubset<T, EntityDeleteArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Entity.
     * @param {EntityUpdateArgs} args - Arguments to update one Entity.
     * @example
     * // Update one Entity
     * const entity = await prisma.entity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EntityUpdateArgs>(args: SelectSubset<T, EntityUpdateArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Entities.
     * @param {EntityDeleteManyArgs} args - Arguments to filter Entities to delete.
     * @example
     * // Delete a few Entities
     * const { count } = await prisma.entity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EntityDeleteManyArgs>(args?: SelectSubset<T, EntityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Entities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Entities
     * const entity = await prisma.entity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EntityUpdateManyArgs>(args: SelectSubset<T, EntityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Entities and returns the data updated in the database.
     * @param {EntityUpdateManyAndReturnArgs} args - Arguments to update many Entities.
     * @example
     * // Update many Entities
     * const entity = await prisma.entity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Entities and only return the `id`
     * const entityWithIdOnly = await prisma.entity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EntityUpdateManyAndReturnArgs>(args: SelectSubset<T, EntityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Entity.
     * @param {EntityUpsertArgs} args - Arguments to update or create a Entity.
     * @example
     * // Update or create a Entity
     * const entity = await prisma.entity.upsert({
     *   create: {
     *     // ... data to create a Entity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Entity we want to update
     *   }
     * })
     */
    upsert<T extends EntityUpsertArgs>(args: SelectSubset<T, EntityUpsertArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Entities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityCountArgs} args - Arguments to filter Entities to count.
     * @example
     * // Count the number of Entities
     * const count = await prisma.entity.count({
     *   where: {
     *     // ... the filter for the Entities we want to count
     *   }
     * })
    **/
    count<T extends EntityCountArgs>(
      args?: Subset<T, EntityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EntityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Entity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EntityAggregateArgs>(args: Subset<T, EntityAggregateArgs>): Prisma.PrismaPromise<GetEntityAggregateType<T>>

    /**
     * Group by Entity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EntityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EntityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EntityGroupByArgs['orderBy'] }
        : { orderBy?: EntityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EntityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Entity model
   */
  readonly fields: EntityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Entity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EntityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scenes<T extends Entity$scenesArgs<ExtArgs> = {}>(args?: Subset<T, Entity$scenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Entity model
   */
  interface EntityFieldRefs {
    readonly id: FieldRef<"Entity", 'String'>
    readonly projectId: FieldRef<"Entity", 'String'>
    readonly type: FieldRef<"Entity", 'EntityType'>
    readonly name: FieldRef<"Entity", 'String'>
    readonly description: FieldRef<"Entity", 'String'>
    readonly attributes: FieldRef<"Entity", 'Json'>
    readonly imageUrl: FieldRef<"Entity", 'String'>
    readonly createdAt: FieldRef<"Entity", 'DateTime'>
    readonly updatedAt: FieldRef<"Entity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Entity findUnique
   */
  export type EntityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * Filter, which Entity to fetch.
     */
    where: EntityWhereUniqueInput
  }

  /**
   * Entity findUniqueOrThrow
   */
  export type EntityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * Filter, which Entity to fetch.
     */
    where: EntityWhereUniqueInput
  }

  /**
   * Entity findFirst
   */
  export type EntityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * Filter, which Entity to fetch.
     */
    where?: EntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entities to fetch.
     */
    orderBy?: EntityOrderByWithRelationInput | EntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Entities.
     */
    cursor?: EntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Entities.
     */
    distinct?: EntityScalarFieldEnum | EntityScalarFieldEnum[]
  }

  /**
   * Entity findFirstOrThrow
   */
  export type EntityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * Filter, which Entity to fetch.
     */
    where?: EntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entities to fetch.
     */
    orderBy?: EntityOrderByWithRelationInput | EntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Entities.
     */
    cursor?: EntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Entities.
     */
    distinct?: EntityScalarFieldEnum | EntityScalarFieldEnum[]
  }

  /**
   * Entity findMany
   */
  export type EntityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * Filter, which Entities to fetch.
     */
    where?: EntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Entities to fetch.
     */
    orderBy?: EntityOrderByWithRelationInput | EntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Entities.
     */
    cursor?: EntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Entities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Entities.
     */
    skip?: number
    distinct?: EntityScalarFieldEnum | EntityScalarFieldEnum[]
  }

  /**
   * Entity create
   */
  export type EntityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * The data needed to create a Entity.
     */
    data: XOR<EntityCreateInput, EntityUncheckedCreateInput>
  }

  /**
   * Entity createMany
   */
  export type EntityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Entities.
     */
    data: EntityCreateManyInput | EntityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Entity createManyAndReturn
   */
  export type EntityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * The data used to create many Entities.
     */
    data: EntityCreateManyInput | EntityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Entity update
   */
  export type EntityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * The data needed to update a Entity.
     */
    data: XOR<EntityUpdateInput, EntityUncheckedUpdateInput>
    /**
     * Choose, which Entity to update.
     */
    where: EntityWhereUniqueInput
  }

  /**
   * Entity updateMany
   */
  export type EntityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Entities.
     */
    data: XOR<EntityUpdateManyMutationInput, EntityUncheckedUpdateManyInput>
    /**
     * Filter which Entities to update
     */
    where?: EntityWhereInput
    /**
     * Limit how many Entities to update.
     */
    limit?: number
  }

  /**
   * Entity updateManyAndReturn
   */
  export type EntityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * The data used to update Entities.
     */
    data: XOR<EntityUpdateManyMutationInput, EntityUncheckedUpdateManyInput>
    /**
     * Filter which Entities to update
     */
    where?: EntityWhereInput
    /**
     * Limit how many Entities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Entity upsert
   */
  export type EntityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * The filter to search for the Entity to update in case it exists.
     */
    where: EntityWhereUniqueInput
    /**
     * In case the Entity found by the `where` argument doesn't exist, create a new Entity with this data.
     */
    create: XOR<EntityCreateInput, EntityUncheckedCreateInput>
    /**
     * In case the Entity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EntityUpdateInput, EntityUncheckedUpdateInput>
  }

  /**
   * Entity delete
   */
  export type EntityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
    /**
     * Filter which Entity to delete.
     */
    where: EntityWhereUniqueInput
  }

  /**
   * Entity deleteMany
   */
  export type EntityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Entities to delete
     */
    where?: EntityWhereInput
    /**
     * Limit how many Entities to delete.
     */
    limit?: number
  }

  /**
   * Entity.scenes
   */
  export type Entity$scenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    where?: SceneEntityWhereInput
    orderBy?: SceneEntityOrderByWithRelationInput | SceneEntityOrderByWithRelationInput[]
    cursor?: SceneEntityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SceneEntityScalarFieldEnum | SceneEntityScalarFieldEnum[]
  }

  /**
   * Entity without action
   */
  export type EntityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Entity
     */
    select?: EntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Entity
     */
    omit?: EntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EntityInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    order: number | null
  }

  export type DocumentSumAggregateOutputType = {
    order: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    title: string | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    title: string | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    projectId: number
    title: number
    content: number
    order: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    order?: true
  }

  export type DocumentSumAggregateInputType = {
    order?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    projectId?: true
    title?: true
    content?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: string
    projectId: string
    title: string
    content: JsonValue
    order: number
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    scenes?: boolean | Document$scenesArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    projectId?: boolean
    title?: boolean
    content?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "title" | "content" | "order" | "createdAt" | "updatedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    scenes?: boolean | Document$scenesArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      scenes: Prisma.$ScenePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      title: string
      content: Prisma.JsonValue
      order: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scenes<T extends Document$scenesArgs<ExtArgs> = {}>(args?: Subset<T, Document$scenesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'String'>
    readonly projectId: FieldRef<"Document", 'String'>
    readonly title: FieldRef<"Document", 'String'>
    readonly content: FieldRef<"Document", 'Json'>
    readonly order: FieldRef<"Document", 'Int'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document.scenes
   */
  export type Document$scenesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    where?: SceneWhereInput
    orderBy?: SceneOrderByWithRelationInput | SceneOrderByWithRelationInput[]
    cursor?: SceneWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SceneScalarFieldEnum | SceneScalarFieldEnum[]
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model Scene
   */

  export type AggregateScene = {
    _count: SceneCountAggregateOutputType | null
    _avg: SceneAvgAggregateOutputType | null
    _sum: SceneSumAggregateOutputType | null
    _min: SceneMinAggregateOutputType | null
    _max: SceneMaxAggregateOutputType | null
  }

  export type SceneAvgAggregateOutputType = {
    startOffset: number | null
    endOffset: number | null
    order: number | null
  }

  export type SceneSumAggregateOutputType = {
    startOffset: number | null
    endOffset: number | null
    order: number | null
  }

  export type SceneMinAggregateOutputType = {
    id: string | null
    documentId: string | null
    title: string | null
    summary: string | null
    startOffset: number | null
    endOffset: number | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SceneMaxAggregateOutputType = {
    id: string | null
    documentId: string | null
    title: string | null
    summary: string | null
    startOffset: number | null
    endOffset: number | null
    order: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SceneCountAggregateOutputType = {
    id: number
    documentId: number
    title: number
    summary: number
    startOffset: number
    endOffset: number
    metadata: number
    order: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SceneAvgAggregateInputType = {
    startOffset?: true
    endOffset?: true
    order?: true
  }

  export type SceneSumAggregateInputType = {
    startOffset?: true
    endOffset?: true
    order?: true
  }

  export type SceneMinAggregateInputType = {
    id?: true
    documentId?: true
    title?: true
    summary?: true
    startOffset?: true
    endOffset?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SceneMaxAggregateInputType = {
    id?: true
    documentId?: true
    title?: true
    summary?: true
    startOffset?: true
    endOffset?: true
    order?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SceneCountAggregateInputType = {
    id?: true
    documentId?: true
    title?: true
    summary?: true
    startOffset?: true
    endOffset?: true
    metadata?: true
    order?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SceneAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scene to aggregate.
     */
    where?: SceneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scenes to fetch.
     */
    orderBy?: SceneOrderByWithRelationInput | SceneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SceneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scenes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scenes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Scenes
    **/
    _count?: true | SceneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SceneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SceneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SceneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SceneMaxAggregateInputType
  }

  export type GetSceneAggregateType<T extends SceneAggregateArgs> = {
        [P in keyof T & keyof AggregateScene]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScene[P]>
      : GetScalarType<T[P], AggregateScene[P]>
  }




  export type SceneGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SceneWhereInput
    orderBy?: SceneOrderByWithAggregationInput | SceneOrderByWithAggregationInput[]
    by: SceneScalarFieldEnum[] | SceneScalarFieldEnum
    having?: SceneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SceneCountAggregateInputType | true
    _avg?: SceneAvgAggregateInputType
    _sum?: SceneSumAggregateInputType
    _min?: SceneMinAggregateInputType
    _max?: SceneMaxAggregateInputType
  }

  export type SceneGroupByOutputType = {
    id: string
    documentId: string
    title: string | null
    summary: string | null
    startOffset: number | null
    endOffset: number | null
    metadata: JsonValue
    order: number
    createdAt: Date
    updatedAt: Date
    _count: SceneCountAggregateOutputType | null
    _avg: SceneAvgAggregateOutputType | null
    _sum: SceneSumAggregateOutputType | null
    _min: SceneMinAggregateOutputType | null
    _max: SceneMaxAggregateOutputType | null
  }

  type GetSceneGroupByPayload<T extends SceneGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SceneGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SceneGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SceneGroupByOutputType[P]>
            : GetScalarType<T[P], SceneGroupByOutputType[P]>
        }
      >
    >


  export type SceneSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    title?: boolean
    summary?: boolean
    startOffset?: boolean
    endOffset?: boolean
    metadata?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
    entities?: boolean | Scene$entitiesArgs<ExtArgs>
    _count?: boolean | SceneCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scene"]>

  export type SceneSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    title?: boolean
    summary?: boolean
    startOffset?: boolean
    endOffset?: boolean
    metadata?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scene"]>

  export type SceneSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    title?: boolean
    summary?: boolean
    startOffset?: boolean
    endOffset?: boolean
    metadata?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scene"]>

  export type SceneSelectScalar = {
    id?: boolean
    documentId?: boolean
    title?: boolean
    summary?: boolean
    startOffset?: boolean
    endOffset?: boolean
    metadata?: boolean
    order?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SceneOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "documentId" | "title" | "summary" | "startOffset" | "endOffset" | "metadata" | "order" | "createdAt" | "updatedAt", ExtArgs["result"]["scene"]>
  export type SceneInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
    entities?: boolean | Scene$entitiesArgs<ExtArgs>
    _count?: boolean | SceneCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SceneIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type SceneIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $ScenePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Scene"
    objects: {
      document: Prisma.$DocumentPayload<ExtArgs>
      entities: Prisma.$SceneEntityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      documentId: string
      title: string | null
      summary: string | null
      startOffset: number | null
      endOffset: number | null
      metadata: Prisma.JsonValue
      order: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["scene"]>
    composites: {}
  }

  type SceneGetPayload<S extends boolean | null | undefined | SceneDefaultArgs> = $Result.GetResult<Prisma.$ScenePayload, S>

  type SceneCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SceneFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SceneCountAggregateInputType | true
    }

  export interface SceneDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Scene'], meta: { name: 'Scene' } }
    /**
     * Find zero or one Scene that matches the filter.
     * @param {SceneFindUniqueArgs} args - Arguments to find a Scene
     * @example
     * // Get one Scene
     * const scene = await prisma.scene.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SceneFindUniqueArgs>(args: SelectSubset<T, SceneFindUniqueArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Scene that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SceneFindUniqueOrThrowArgs} args - Arguments to find a Scene
     * @example
     * // Get one Scene
     * const scene = await prisma.scene.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SceneFindUniqueOrThrowArgs>(args: SelectSubset<T, SceneFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Scene that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneFindFirstArgs} args - Arguments to find a Scene
     * @example
     * // Get one Scene
     * const scene = await prisma.scene.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SceneFindFirstArgs>(args?: SelectSubset<T, SceneFindFirstArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Scene that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneFindFirstOrThrowArgs} args - Arguments to find a Scene
     * @example
     * // Get one Scene
     * const scene = await prisma.scene.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SceneFindFirstOrThrowArgs>(args?: SelectSubset<T, SceneFindFirstOrThrowArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Scenes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scenes
     * const scenes = await prisma.scene.findMany()
     * 
     * // Get first 10 Scenes
     * const scenes = await prisma.scene.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sceneWithIdOnly = await prisma.scene.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SceneFindManyArgs>(args?: SelectSubset<T, SceneFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Scene.
     * @param {SceneCreateArgs} args - Arguments to create a Scene.
     * @example
     * // Create one Scene
     * const Scene = await prisma.scene.create({
     *   data: {
     *     // ... data to create a Scene
     *   }
     * })
     * 
     */
    create<T extends SceneCreateArgs>(args: SelectSubset<T, SceneCreateArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Scenes.
     * @param {SceneCreateManyArgs} args - Arguments to create many Scenes.
     * @example
     * // Create many Scenes
     * const scene = await prisma.scene.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SceneCreateManyArgs>(args?: SelectSubset<T, SceneCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Scenes and returns the data saved in the database.
     * @param {SceneCreateManyAndReturnArgs} args - Arguments to create many Scenes.
     * @example
     * // Create many Scenes
     * const scene = await prisma.scene.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Scenes and only return the `id`
     * const sceneWithIdOnly = await prisma.scene.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SceneCreateManyAndReturnArgs>(args?: SelectSubset<T, SceneCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Scene.
     * @param {SceneDeleteArgs} args - Arguments to delete one Scene.
     * @example
     * // Delete one Scene
     * const Scene = await prisma.scene.delete({
     *   where: {
     *     // ... filter to delete one Scene
     *   }
     * })
     * 
     */
    delete<T extends SceneDeleteArgs>(args: SelectSubset<T, SceneDeleteArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Scene.
     * @param {SceneUpdateArgs} args - Arguments to update one Scene.
     * @example
     * // Update one Scene
     * const scene = await prisma.scene.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SceneUpdateArgs>(args: SelectSubset<T, SceneUpdateArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Scenes.
     * @param {SceneDeleteManyArgs} args - Arguments to filter Scenes to delete.
     * @example
     * // Delete a few Scenes
     * const { count } = await prisma.scene.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SceneDeleteManyArgs>(args?: SelectSubset<T, SceneDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scenes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scenes
     * const scene = await prisma.scene.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SceneUpdateManyArgs>(args: SelectSubset<T, SceneUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scenes and returns the data updated in the database.
     * @param {SceneUpdateManyAndReturnArgs} args - Arguments to update many Scenes.
     * @example
     * // Update many Scenes
     * const scene = await prisma.scene.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Scenes and only return the `id`
     * const sceneWithIdOnly = await prisma.scene.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SceneUpdateManyAndReturnArgs>(args: SelectSubset<T, SceneUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Scene.
     * @param {SceneUpsertArgs} args - Arguments to update or create a Scene.
     * @example
     * // Update or create a Scene
     * const scene = await prisma.scene.upsert({
     *   create: {
     *     // ... data to create a Scene
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Scene we want to update
     *   }
     * })
     */
    upsert<T extends SceneUpsertArgs>(args: SelectSubset<T, SceneUpsertArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Scenes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneCountArgs} args - Arguments to filter Scenes to count.
     * @example
     * // Count the number of Scenes
     * const count = await prisma.scene.count({
     *   where: {
     *     // ... the filter for the Scenes we want to count
     *   }
     * })
    **/
    count<T extends SceneCountArgs>(
      args?: Subset<T, SceneCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SceneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Scene.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SceneAggregateArgs>(args: Subset<T, SceneAggregateArgs>): Prisma.PrismaPromise<GetSceneAggregateType<T>>

    /**
     * Group by Scene.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SceneGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SceneGroupByArgs['orderBy'] }
        : { orderBy?: SceneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SceneGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSceneGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Scene model
   */
  readonly fields: SceneFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Scene.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SceneClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    entities<T extends Scene$entitiesArgs<ExtArgs> = {}>(args?: Subset<T, Scene$entitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Scene model
   */
  interface SceneFieldRefs {
    readonly id: FieldRef<"Scene", 'String'>
    readonly documentId: FieldRef<"Scene", 'String'>
    readonly title: FieldRef<"Scene", 'String'>
    readonly summary: FieldRef<"Scene", 'String'>
    readonly startOffset: FieldRef<"Scene", 'Int'>
    readonly endOffset: FieldRef<"Scene", 'Int'>
    readonly metadata: FieldRef<"Scene", 'Json'>
    readonly order: FieldRef<"Scene", 'Int'>
    readonly createdAt: FieldRef<"Scene", 'DateTime'>
    readonly updatedAt: FieldRef<"Scene", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Scene findUnique
   */
  export type SceneFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * Filter, which Scene to fetch.
     */
    where: SceneWhereUniqueInput
  }

  /**
   * Scene findUniqueOrThrow
   */
  export type SceneFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * Filter, which Scene to fetch.
     */
    where: SceneWhereUniqueInput
  }

  /**
   * Scene findFirst
   */
  export type SceneFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * Filter, which Scene to fetch.
     */
    where?: SceneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scenes to fetch.
     */
    orderBy?: SceneOrderByWithRelationInput | SceneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scenes.
     */
    cursor?: SceneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scenes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scenes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scenes.
     */
    distinct?: SceneScalarFieldEnum | SceneScalarFieldEnum[]
  }

  /**
   * Scene findFirstOrThrow
   */
  export type SceneFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * Filter, which Scene to fetch.
     */
    where?: SceneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scenes to fetch.
     */
    orderBy?: SceneOrderByWithRelationInput | SceneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scenes.
     */
    cursor?: SceneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scenes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scenes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scenes.
     */
    distinct?: SceneScalarFieldEnum | SceneScalarFieldEnum[]
  }

  /**
   * Scene findMany
   */
  export type SceneFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * Filter, which Scenes to fetch.
     */
    where?: SceneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scenes to fetch.
     */
    orderBy?: SceneOrderByWithRelationInput | SceneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Scenes.
     */
    cursor?: SceneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scenes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scenes.
     */
    skip?: number
    distinct?: SceneScalarFieldEnum | SceneScalarFieldEnum[]
  }

  /**
   * Scene create
   */
  export type SceneCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * The data needed to create a Scene.
     */
    data: XOR<SceneCreateInput, SceneUncheckedCreateInput>
  }

  /**
   * Scene createMany
   */
  export type SceneCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Scenes.
     */
    data: SceneCreateManyInput | SceneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Scene createManyAndReturn
   */
  export type SceneCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * The data used to create many Scenes.
     */
    data: SceneCreateManyInput | SceneCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Scene update
   */
  export type SceneUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * The data needed to update a Scene.
     */
    data: XOR<SceneUpdateInput, SceneUncheckedUpdateInput>
    /**
     * Choose, which Scene to update.
     */
    where: SceneWhereUniqueInput
  }

  /**
   * Scene updateMany
   */
  export type SceneUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Scenes.
     */
    data: XOR<SceneUpdateManyMutationInput, SceneUncheckedUpdateManyInput>
    /**
     * Filter which Scenes to update
     */
    where?: SceneWhereInput
    /**
     * Limit how many Scenes to update.
     */
    limit?: number
  }

  /**
   * Scene updateManyAndReturn
   */
  export type SceneUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * The data used to update Scenes.
     */
    data: XOR<SceneUpdateManyMutationInput, SceneUncheckedUpdateManyInput>
    /**
     * Filter which Scenes to update
     */
    where?: SceneWhereInput
    /**
     * Limit how many Scenes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Scene upsert
   */
  export type SceneUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * The filter to search for the Scene to update in case it exists.
     */
    where: SceneWhereUniqueInput
    /**
     * In case the Scene found by the `where` argument doesn't exist, create a new Scene with this data.
     */
    create: XOR<SceneCreateInput, SceneUncheckedCreateInput>
    /**
     * In case the Scene was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SceneUpdateInput, SceneUncheckedUpdateInput>
  }

  /**
   * Scene delete
   */
  export type SceneDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
    /**
     * Filter which Scene to delete.
     */
    where: SceneWhereUniqueInput
  }

  /**
   * Scene deleteMany
   */
  export type SceneDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scenes to delete
     */
    where?: SceneWhereInput
    /**
     * Limit how many Scenes to delete.
     */
    limit?: number
  }

  /**
   * Scene.entities
   */
  export type Scene$entitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    where?: SceneEntityWhereInput
    orderBy?: SceneEntityOrderByWithRelationInput | SceneEntityOrderByWithRelationInput[]
    cursor?: SceneEntityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SceneEntityScalarFieldEnum | SceneEntityScalarFieldEnum[]
  }

  /**
   * Scene without action
   */
  export type SceneDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scene
     */
    select?: SceneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Scene
     */
    omit?: SceneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneInclude<ExtArgs> | null
  }


  /**
   * Model SceneEntity
   */

  export type AggregateSceneEntity = {
    _count: SceneEntityCountAggregateOutputType | null
    _min: SceneEntityMinAggregateOutputType | null
    _max: SceneEntityMaxAggregateOutputType | null
  }

  export type SceneEntityMinAggregateOutputType = {
    id: string | null
    sceneId: string | null
    entityId: string | null
    role: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type SceneEntityMaxAggregateOutputType = {
    id: string | null
    sceneId: string | null
    entityId: string | null
    role: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type SceneEntityCountAggregateOutputType = {
    id: number
    sceneId: number
    entityId: number
    role: number
    notes: number
    createdAt: number
    _all: number
  }


  export type SceneEntityMinAggregateInputType = {
    id?: true
    sceneId?: true
    entityId?: true
    role?: true
    notes?: true
    createdAt?: true
  }

  export type SceneEntityMaxAggregateInputType = {
    id?: true
    sceneId?: true
    entityId?: true
    role?: true
    notes?: true
    createdAt?: true
  }

  export type SceneEntityCountAggregateInputType = {
    id?: true
    sceneId?: true
    entityId?: true
    role?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type SceneEntityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SceneEntity to aggregate.
     */
    where?: SceneEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SceneEntities to fetch.
     */
    orderBy?: SceneEntityOrderByWithRelationInput | SceneEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SceneEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SceneEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SceneEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SceneEntities
    **/
    _count?: true | SceneEntityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SceneEntityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SceneEntityMaxAggregateInputType
  }

  export type GetSceneEntityAggregateType<T extends SceneEntityAggregateArgs> = {
        [P in keyof T & keyof AggregateSceneEntity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSceneEntity[P]>
      : GetScalarType<T[P], AggregateSceneEntity[P]>
  }




  export type SceneEntityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SceneEntityWhereInput
    orderBy?: SceneEntityOrderByWithAggregationInput | SceneEntityOrderByWithAggregationInput[]
    by: SceneEntityScalarFieldEnum[] | SceneEntityScalarFieldEnum
    having?: SceneEntityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SceneEntityCountAggregateInputType | true
    _min?: SceneEntityMinAggregateInputType
    _max?: SceneEntityMaxAggregateInputType
  }

  export type SceneEntityGroupByOutputType = {
    id: string
    sceneId: string
    entityId: string
    role: string | null
    notes: string | null
    createdAt: Date
    _count: SceneEntityCountAggregateOutputType | null
    _min: SceneEntityMinAggregateOutputType | null
    _max: SceneEntityMaxAggregateOutputType | null
  }

  type GetSceneEntityGroupByPayload<T extends SceneEntityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SceneEntityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SceneEntityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SceneEntityGroupByOutputType[P]>
            : GetScalarType<T[P], SceneEntityGroupByOutputType[P]>
        }
      >
    >


  export type SceneEntitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sceneId?: boolean
    entityId?: boolean
    role?: boolean
    notes?: boolean
    createdAt?: boolean
    scene?: boolean | SceneDefaultArgs<ExtArgs>
    entity?: boolean | EntityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sceneEntity"]>

  export type SceneEntitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sceneId?: boolean
    entityId?: boolean
    role?: boolean
    notes?: boolean
    createdAt?: boolean
    scene?: boolean | SceneDefaultArgs<ExtArgs>
    entity?: boolean | EntityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sceneEntity"]>

  export type SceneEntitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sceneId?: boolean
    entityId?: boolean
    role?: boolean
    notes?: boolean
    createdAt?: boolean
    scene?: boolean | SceneDefaultArgs<ExtArgs>
    entity?: boolean | EntityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sceneEntity"]>

  export type SceneEntitySelectScalar = {
    id?: boolean
    sceneId?: boolean
    entityId?: boolean
    role?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type SceneEntityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sceneId" | "entityId" | "role" | "notes" | "createdAt", ExtArgs["result"]["sceneEntity"]>
  export type SceneEntityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scene?: boolean | SceneDefaultArgs<ExtArgs>
    entity?: boolean | EntityDefaultArgs<ExtArgs>
  }
  export type SceneEntityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scene?: boolean | SceneDefaultArgs<ExtArgs>
    entity?: boolean | EntityDefaultArgs<ExtArgs>
  }
  export type SceneEntityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scene?: boolean | SceneDefaultArgs<ExtArgs>
    entity?: boolean | EntityDefaultArgs<ExtArgs>
  }

  export type $SceneEntityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SceneEntity"
    objects: {
      scene: Prisma.$ScenePayload<ExtArgs>
      entity: Prisma.$EntityPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sceneId: string
      entityId: string
      role: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["sceneEntity"]>
    composites: {}
  }

  type SceneEntityGetPayload<S extends boolean | null | undefined | SceneEntityDefaultArgs> = $Result.GetResult<Prisma.$SceneEntityPayload, S>

  type SceneEntityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SceneEntityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SceneEntityCountAggregateInputType | true
    }

  export interface SceneEntityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SceneEntity'], meta: { name: 'SceneEntity' } }
    /**
     * Find zero or one SceneEntity that matches the filter.
     * @param {SceneEntityFindUniqueArgs} args - Arguments to find a SceneEntity
     * @example
     * // Get one SceneEntity
     * const sceneEntity = await prisma.sceneEntity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SceneEntityFindUniqueArgs>(args: SelectSubset<T, SceneEntityFindUniqueArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SceneEntity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SceneEntityFindUniqueOrThrowArgs} args - Arguments to find a SceneEntity
     * @example
     * // Get one SceneEntity
     * const sceneEntity = await prisma.sceneEntity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SceneEntityFindUniqueOrThrowArgs>(args: SelectSubset<T, SceneEntityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SceneEntity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityFindFirstArgs} args - Arguments to find a SceneEntity
     * @example
     * // Get one SceneEntity
     * const sceneEntity = await prisma.sceneEntity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SceneEntityFindFirstArgs>(args?: SelectSubset<T, SceneEntityFindFirstArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SceneEntity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityFindFirstOrThrowArgs} args - Arguments to find a SceneEntity
     * @example
     * // Get one SceneEntity
     * const sceneEntity = await prisma.sceneEntity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SceneEntityFindFirstOrThrowArgs>(args?: SelectSubset<T, SceneEntityFindFirstOrThrowArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SceneEntities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SceneEntities
     * const sceneEntities = await prisma.sceneEntity.findMany()
     * 
     * // Get first 10 SceneEntities
     * const sceneEntities = await prisma.sceneEntity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sceneEntityWithIdOnly = await prisma.sceneEntity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SceneEntityFindManyArgs>(args?: SelectSubset<T, SceneEntityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SceneEntity.
     * @param {SceneEntityCreateArgs} args - Arguments to create a SceneEntity.
     * @example
     * // Create one SceneEntity
     * const SceneEntity = await prisma.sceneEntity.create({
     *   data: {
     *     // ... data to create a SceneEntity
     *   }
     * })
     * 
     */
    create<T extends SceneEntityCreateArgs>(args: SelectSubset<T, SceneEntityCreateArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SceneEntities.
     * @param {SceneEntityCreateManyArgs} args - Arguments to create many SceneEntities.
     * @example
     * // Create many SceneEntities
     * const sceneEntity = await prisma.sceneEntity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SceneEntityCreateManyArgs>(args?: SelectSubset<T, SceneEntityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SceneEntities and returns the data saved in the database.
     * @param {SceneEntityCreateManyAndReturnArgs} args - Arguments to create many SceneEntities.
     * @example
     * // Create many SceneEntities
     * const sceneEntity = await prisma.sceneEntity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SceneEntities and only return the `id`
     * const sceneEntityWithIdOnly = await prisma.sceneEntity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SceneEntityCreateManyAndReturnArgs>(args?: SelectSubset<T, SceneEntityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SceneEntity.
     * @param {SceneEntityDeleteArgs} args - Arguments to delete one SceneEntity.
     * @example
     * // Delete one SceneEntity
     * const SceneEntity = await prisma.sceneEntity.delete({
     *   where: {
     *     // ... filter to delete one SceneEntity
     *   }
     * })
     * 
     */
    delete<T extends SceneEntityDeleteArgs>(args: SelectSubset<T, SceneEntityDeleteArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SceneEntity.
     * @param {SceneEntityUpdateArgs} args - Arguments to update one SceneEntity.
     * @example
     * // Update one SceneEntity
     * const sceneEntity = await prisma.sceneEntity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SceneEntityUpdateArgs>(args: SelectSubset<T, SceneEntityUpdateArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SceneEntities.
     * @param {SceneEntityDeleteManyArgs} args - Arguments to filter SceneEntities to delete.
     * @example
     * // Delete a few SceneEntities
     * const { count } = await prisma.sceneEntity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SceneEntityDeleteManyArgs>(args?: SelectSubset<T, SceneEntityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SceneEntities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SceneEntities
     * const sceneEntity = await prisma.sceneEntity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SceneEntityUpdateManyArgs>(args: SelectSubset<T, SceneEntityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SceneEntities and returns the data updated in the database.
     * @param {SceneEntityUpdateManyAndReturnArgs} args - Arguments to update many SceneEntities.
     * @example
     * // Update many SceneEntities
     * const sceneEntity = await prisma.sceneEntity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SceneEntities and only return the `id`
     * const sceneEntityWithIdOnly = await prisma.sceneEntity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SceneEntityUpdateManyAndReturnArgs>(args: SelectSubset<T, SceneEntityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SceneEntity.
     * @param {SceneEntityUpsertArgs} args - Arguments to update or create a SceneEntity.
     * @example
     * // Update or create a SceneEntity
     * const sceneEntity = await prisma.sceneEntity.upsert({
     *   create: {
     *     // ... data to create a SceneEntity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SceneEntity we want to update
     *   }
     * })
     */
    upsert<T extends SceneEntityUpsertArgs>(args: SelectSubset<T, SceneEntityUpsertArgs<ExtArgs>>): Prisma__SceneEntityClient<$Result.GetResult<Prisma.$SceneEntityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SceneEntities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityCountArgs} args - Arguments to filter SceneEntities to count.
     * @example
     * // Count the number of SceneEntities
     * const count = await prisma.sceneEntity.count({
     *   where: {
     *     // ... the filter for the SceneEntities we want to count
     *   }
     * })
    **/
    count<T extends SceneEntityCountArgs>(
      args?: Subset<T, SceneEntityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SceneEntityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SceneEntity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SceneEntityAggregateArgs>(args: Subset<T, SceneEntityAggregateArgs>): Prisma.PrismaPromise<GetSceneEntityAggregateType<T>>

    /**
     * Group by SceneEntity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SceneEntityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SceneEntityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SceneEntityGroupByArgs['orderBy'] }
        : { orderBy?: SceneEntityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SceneEntityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSceneEntityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SceneEntity model
   */
  readonly fields: SceneEntityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SceneEntity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SceneEntityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scene<T extends SceneDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SceneDefaultArgs<ExtArgs>>): Prisma__SceneClient<$Result.GetResult<Prisma.$ScenePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    entity<T extends EntityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EntityDefaultArgs<ExtArgs>>): Prisma__EntityClient<$Result.GetResult<Prisma.$EntityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SceneEntity model
   */
  interface SceneEntityFieldRefs {
    readonly id: FieldRef<"SceneEntity", 'String'>
    readonly sceneId: FieldRef<"SceneEntity", 'String'>
    readonly entityId: FieldRef<"SceneEntity", 'String'>
    readonly role: FieldRef<"SceneEntity", 'String'>
    readonly notes: FieldRef<"SceneEntity", 'String'>
    readonly createdAt: FieldRef<"SceneEntity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SceneEntity findUnique
   */
  export type SceneEntityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * Filter, which SceneEntity to fetch.
     */
    where: SceneEntityWhereUniqueInput
  }

  /**
   * SceneEntity findUniqueOrThrow
   */
  export type SceneEntityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * Filter, which SceneEntity to fetch.
     */
    where: SceneEntityWhereUniqueInput
  }

  /**
   * SceneEntity findFirst
   */
  export type SceneEntityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * Filter, which SceneEntity to fetch.
     */
    where?: SceneEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SceneEntities to fetch.
     */
    orderBy?: SceneEntityOrderByWithRelationInput | SceneEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SceneEntities.
     */
    cursor?: SceneEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SceneEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SceneEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SceneEntities.
     */
    distinct?: SceneEntityScalarFieldEnum | SceneEntityScalarFieldEnum[]
  }

  /**
   * SceneEntity findFirstOrThrow
   */
  export type SceneEntityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * Filter, which SceneEntity to fetch.
     */
    where?: SceneEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SceneEntities to fetch.
     */
    orderBy?: SceneEntityOrderByWithRelationInput | SceneEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SceneEntities.
     */
    cursor?: SceneEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SceneEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SceneEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SceneEntities.
     */
    distinct?: SceneEntityScalarFieldEnum | SceneEntityScalarFieldEnum[]
  }

  /**
   * SceneEntity findMany
   */
  export type SceneEntityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * Filter, which SceneEntities to fetch.
     */
    where?: SceneEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SceneEntities to fetch.
     */
    orderBy?: SceneEntityOrderByWithRelationInput | SceneEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SceneEntities.
     */
    cursor?: SceneEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SceneEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SceneEntities.
     */
    skip?: number
    distinct?: SceneEntityScalarFieldEnum | SceneEntityScalarFieldEnum[]
  }

  /**
   * SceneEntity create
   */
  export type SceneEntityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * The data needed to create a SceneEntity.
     */
    data: XOR<SceneEntityCreateInput, SceneEntityUncheckedCreateInput>
  }

  /**
   * SceneEntity createMany
   */
  export type SceneEntityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SceneEntities.
     */
    data: SceneEntityCreateManyInput | SceneEntityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SceneEntity createManyAndReturn
   */
  export type SceneEntityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * The data used to create many SceneEntities.
     */
    data: SceneEntityCreateManyInput | SceneEntityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SceneEntity update
   */
  export type SceneEntityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * The data needed to update a SceneEntity.
     */
    data: XOR<SceneEntityUpdateInput, SceneEntityUncheckedUpdateInput>
    /**
     * Choose, which SceneEntity to update.
     */
    where: SceneEntityWhereUniqueInput
  }

  /**
   * SceneEntity updateMany
   */
  export type SceneEntityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SceneEntities.
     */
    data: XOR<SceneEntityUpdateManyMutationInput, SceneEntityUncheckedUpdateManyInput>
    /**
     * Filter which SceneEntities to update
     */
    where?: SceneEntityWhereInput
    /**
     * Limit how many SceneEntities to update.
     */
    limit?: number
  }

  /**
   * SceneEntity updateManyAndReturn
   */
  export type SceneEntityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * The data used to update SceneEntities.
     */
    data: XOR<SceneEntityUpdateManyMutationInput, SceneEntityUncheckedUpdateManyInput>
    /**
     * Filter which SceneEntities to update
     */
    where?: SceneEntityWhereInput
    /**
     * Limit how many SceneEntities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SceneEntity upsert
   */
  export type SceneEntityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * The filter to search for the SceneEntity to update in case it exists.
     */
    where: SceneEntityWhereUniqueInput
    /**
     * In case the SceneEntity found by the `where` argument doesn't exist, create a new SceneEntity with this data.
     */
    create: XOR<SceneEntityCreateInput, SceneEntityUncheckedCreateInput>
    /**
     * In case the SceneEntity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SceneEntityUpdateInput, SceneEntityUncheckedUpdateInput>
  }

  /**
   * SceneEntity delete
   */
  export type SceneEntityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
    /**
     * Filter which SceneEntity to delete.
     */
    where: SceneEntityWhereUniqueInput
  }

  /**
   * SceneEntity deleteMany
   */
  export type SceneEntityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SceneEntities to delete
     */
    where?: SceneEntityWhereInput
    /**
     * Limit how many SceneEntities to delete.
     */
    limit?: number
  }

  /**
   * SceneEntity without action
   */
  export type SceneEntityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SceneEntity
     */
    select?: SceneEntitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SceneEntity
     */
    omit?: SceneEntityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SceneEntityInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    settings: 'settings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const EntityScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    type: 'type',
    name: 'name',
    description: 'description',
    attributes: 'attributes',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EntityScalarFieldEnum = (typeof EntityScalarFieldEnum)[keyof typeof EntityScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    title: 'title',
    content: 'content',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const SceneScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    title: 'title',
    summary: 'summary',
    startOffset: 'startOffset',
    endOffset: 'endOffset',
    metadata: 'metadata',
    order: 'order',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SceneScalarFieldEnum = (typeof SceneScalarFieldEnum)[keyof typeof SceneScalarFieldEnum]


  export const SceneEntityScalarFieldEnum: {
    id: 'id',
    sceneId: 'sceneId',
    entityId: 'entityId',
    role: 'role',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type SceneEntityScalarFieldEnum = (typeof SceneEntityScalarFieldEnum)[keyof typeof SceneEntityScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'EntityType'
   */
  export type EnumEntityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EntityType'>
    


  /**
   * Reference to a field of type 'EntityType[]'
   */
  export type ListEnumEntityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EntityType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    settings?: JsonFilter<"Project">
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    documents?: DocumentListRelationFilter
    entities?: EntityListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    documents?: DocumentOrderByRelationAggregateInput
    entities?: EntityOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    title?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    settings?: JsonFilter<"Project">
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    documents?: DocumentListRelationFilter
    entities?: EntityListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    title?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    settings?: JsonWithAggregatesFilter<"Project">
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type EntityWhereInput = {
    AND?: EntityWhereInput | EntityWhereInput[]
    OR?: EntityWhereInput[]
    NOT?: EntityWhereInput | EntityWhereInput[]
    id?: StringFilter<"Entity"> | string
    projectId?: StringFilter<"Entity"> | string
    type?: EnumEntityTypeFilter<"Entity"> | $Enums.EntityType
    name?: StringFilter<"Entity"> | string
    description?: StringNullableFilter<"Entity"> | string | null
    attributes?: JsonFilter<"Entity">
    imageUrl?: StringNullableFilter<"Entity"> | string | null
    createdAt?: DateTimeFilter<"Entity"> | Date | string
    updatedAt?: DateTimeFilter<"Entity"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    scenes?: SceneEntityListRelationFilter
  }

  export type EntityOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    attributes?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    scenes?: SceneEntityOrderByRelationAggregateInput
  }

  export type EntityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EntityWhereInput | EntityWhereInput[]
    OR?: EntityWhereInput[]
    NOT?: EntityWhereInput | EntityWhereInput[]
    projectId?: StringFilter<"Entity"> | string
    type?: EnumEntityTypeFilter<"Entity"> | $Enums.EntityType
    name?: StringFilter<"Entity"> | string
    description?: StringNullableFilter<"Entity"> | string | null
    attributes?: JsonFilter<"Entity">
    imageUrl?: StringNullableFilter<"Entity"> | string | null
    createdAt?: DateTimeFilter<"Entity"> | Date | string
    updatedAt?: DateTimeFilter<"Entity"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    scenes?: SceneEntityListRelationFilter
  }, "id">

  export type EntityOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    attributes?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EntityCountOrderByAggregateInput
    _max?: EntityMaxOrderByAggregateInput
    _min?: EntityMinOrderByAggregateInput
  }

  export type EntityScalarWhereWithAggregatesInput = {
    AND?: EntityScalarWhereWithAggregatesInput | EntityScalarWhereWithAggregatesInput[]
    OR?: EntityScalarWhereWithAggregatesInput[]
    NOT?: EntityScalarWhereWithAggregatesInput | EntityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Entity"> | string
    projectId?: StringWithAggregatesFilter<"Entity"> | string
    type?: EnumEntityTypeWithAggregatesFilter<"Entity"> | $Enums.EntityType
    name?: StringWithAggregatesFilter<"Entity"> | string
    description?: StringNullableWithAggregatesFilter<"Entity"> | string | null
    attributes?: JsonWithAggregatesFilter<"Entity">
    imageUrl?: StringNullableWithAggregatesFilter<"Entity"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Entity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Entity"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: StringFilter<"Document"> | string
    projectId?: StringFilter<"Document"> | string
    title?: StringFilter<"Document"> | string
    content?: JsonFilter<"Document">
    order?: IntFilter<"Document"> | number
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    scenes?: SceneListRelationFilter
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    scenes?: SceneOrderByRelationAggregateInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    projectId?: StringFilter<"Document"> | string
    title?: StringFilter<"Document"> | string
    content?: JsonFilter<"Document">
    order?: IntFilter<"Document"> | number
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    scenes?: SceneListRelationFilter
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Document"> | string
    projectId?: StringWithAggregatesFilter<"Document"> | string
    title?: StringWithAggregatesFilter<"Document"> | string
    content?: JsonWithAggregatesFilter<"Document">
    order?: IntWithAggregatesFilter<"Document"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type SceneWhereInput = {
    AND?: SceneWhereInput | SceneWhereInput[]
    OR?: SceneWhereInput[]
    NOT?: SceneWhereInput | SceneWhereInput[]
    id?: StringFilter<"Scene"> | string
    documentId?: StringFilter<"Scene"> | string
    title?: StringNullableFilter<"Scene"> | string | null
    summary?: StringNullableFilter<"Scene"> | string | null
    startOffset?: IntNullableFilter<"Scene"> | number | null
    endOffset?: IntNullableFilter<"Scene"> | number | null
    metadata?: JsonFilter<"Scene">
    order?: IntFilter<"Scene"> | number
    createdAt?: DateTimeFilter<"Scene"> | Date | string
    updatedAt?: DateTimeFilter<"Scene"> | Date | string
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
    entities?: SceneEntityListRelationFilter
  }

  export type SceneOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    title?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    startOffset?: SortOrderInput | SortOrder
    endOffset?: SortOrderInput | SortOrder
    metadata?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    document?: DocumentOrderByWithRelationInput
    entities?: SceneEntityOrderByRelationAggregateInput
  }

  export type SceneWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SceneWhereInput | SceneWhereInput[]
    OR?: SceneWhereInput[]
    NOT?: SceneWhereInput | SceneWhereInput[]
    documentId?: StringFilter<"Scene"> | string
    title?: StringNullableFilter<"Scene"> | string | null
    summary?: StringNullableFilter<"Scene"> | string | null
    startOffset?: IntNullableFilter<"Scene"> | number | null
    endOffset?: IntNullableFilter<"Scene"> | number | null
    metadata?: JsonFilter<"Scene">
    order?: IntFilter<"Scene"> | number
    createdAt?: DateTimeFilter<"Scene"> | Date | string
    updatedAt?: DateTimeFilter<"Scene"> | Date | string
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
    entities?: SceneEntityListRelationFilter
  }, "id">

  export type SceneOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    title?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    startOffset?: SortOrderInput | SortOrder
    endOffset?: SortOrderInput | SortOrder
    metadata?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SceneCountOrderByAggregateInput
    _avg?: SceneAvgOrderByAggregateInput
    _max?: SceneMaxOrderByAggregateInput
    _min?: SceneMinOrderByAggregateInput
    _sum?: SceneSumOrderByAggregateInput
  }

  export type SceneScalarWhereWithAggregatesInput = {
    AND?: SceneScalarWhereWithAggregatesInput | SceneScalarWhereWithAggregatesInput[]
    OR?: SceneScalarWhereWithAggregatesInput[]
    NOT?: SceneScalarWhereWithAggregatesInput | SceneScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Scene"> | string
    documentId?: StringWithAggregatesFilter<"Scene"> | string
    title?: StringNullableWithAggregatesFilter<"Scene"> | string | null
    summary?: StringNullableWithAggregatesFilter<"Scene"> | string | null
    startOffset?: IntNullableWithAggregatesFilter<"Scene"> | number | null
    endOffset?: IntNullableWithAggregatesFilter<"Scene"> | number | null
    metadata?: JsonWithAggregatesFilter<"Scene">
    order?: IntWithAggregatesFilter<"Scene"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Scene"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Scene"> | Date | string
  }

  export type SceneEntityWhereInput = {
    AND?: SceneEntityWhereInput | SceneEntityWhereInput[]
    OR?: SceneEntityWhereInput[]
    NOT?: SceneEntityWhereInput | SceneEntityWhereInput[]
    id?: StringFilter<"SceneEntity"> | string
    sceneId?: StringFilter<"SceneEntity"> | string
    entityId?: StringFilter<"SceneEntity"> | string
    role?: StringNullableFilter<"SceneEntity"> | string | null
    notes?: StringNullableFilter<"SceneEntity"> | string | null
    createdAt?: DateTimeFilter<"SceneEntity"> | Date | string
    scene?: XOR<SceneScalarRelationFilter, SceneWhereInput>
    entity?: XOR<EntityScalarRelationFilter, EntityWhereInput>
  }

  export type SceneEntityOrderByWithRelationInput = {
    id?: SortOrder
    sceneId?: SortOrder
    entityId?: SortOrder
    role?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    scene?: SceneOrderByWithRelationInput
    entity?: EntityOrderByWithRelationInput
  }

  export type SceneEntityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sceneId_entityId?: SceneEntitySceneIdEntityIdCompoundUniqueInput
    AND?: SceneEntityWhereInput | SceneEntityWhereInput[]
    OR?: SceneEntityWhereInput[]
    NOT?: SceneEntityWhereInput | SceneEntityWhereInput[]
    sceneId?: StringFilter<"SceneEntity"> | string
    entityId?: StringFilter<"SceneEntity"> | string
    role?: StringNullableFilter<"SceneEntity"> | string | null
    notes?: StringNullableFilter<"SceneEntity"> | string | null
    createdAt?: DateTimeFilter<"SceneEntity"> | Date | string
    scene?: XOR<SceneScalarRelationFilter, SceneWhereInput>
    entity?: XOR<EntityScalarRelationFilter, EntityWhereInput>
  }, "id" | "sceneId_entityId">

  export type SceneEntityOrderByWithAggregationInput = {
    id?: SortOrder
    sceneId?: SortOrder
    entityId?: SortOrder
    role?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SceneEntityCountOrderByAggregateInput
    _max?: SceneEntityMaxOrderByAggregateInput
    _min?: SceneEntityMinOrderByAggregateInput
  }

  export type SceneEntityScalarWhereWithAggregatesInput = {
    AND?: SceneEntityScalarWhereWithAggregatesInput | SceneEntityScalarWhereWithAggregatesInput[]
    OR?: SceneEntityScalarWhereWithAggregatesInput[]
    NOT?: SceneEntityScalarWhereWithAggregatesInput | SceneEntityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SceneEntity"> | string
    sceneId?: StringWithAggregatesFilter<"SceneEntity"> | string
    entityId?: StringWithAggregatesFilter<"SceneEntity"> | string
    role?: StringNullableWithAggregatesFilter<"SceneEntity"> | string | null
    notes?: StringNullableWithAggregatesFilter<"SceneEntity"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SceneEntity"> | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutProjectInput
    entities?: EntityCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
    entities?: EntityUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutProjectNestedInput
    entities?: EntityUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
    entities?: EntityUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityCreateInput = {
    id?: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutEntitiesInput
    scenes?: SceneEntityCreateNestedManyWithoutEntityInput
  }

  export type EntityUncheckedCreateInput = {
    id?: string
    projectId: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scenes?: SceneEntityUncheckedCreateNestedManyWithoutEntityInput
  }

  export type EntityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutEntitiesNestedInput
    scenes?: SceneEntityUpdateManyWithoutEntityNestedInput
  }

  export type EntityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenes?: SceneEntityUncheckedUpdateManyWithoutEntityNestedInput
  }

  export type EntityCreateManyInput = {
    id?: string
    projectId: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EntityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    id?: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutDocumentsInput
    scenes?: SceneCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: string
    projectId: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    scenes?: SceneUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDocumentsNestedInput
    scenes?: SceneUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenes?: SceneUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: string
    projectId: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneCreateInput = {
    id?: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutScenesInput
    entities?: SceneEntityCreateNestedManyWithoutSceneInput
  }

  export type SceneUncheckedCreateInput = {
    id?: string
    documentId: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    entities?: SceneEntityUncheckedCreateNestedManyWithoutSceneInput
  }

  export type SceneUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutScenesNestedInput
    entities?: SceneEntityUpdateManyWithoutSceneNestedInput
  }

  export type SceneUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entities?: SceneEntityUncheckedUpdateManyWithoutSceneNestedInput
  }

  export type SceneCreateManyInput = {
    id?: string
    documentId: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SceneUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityCreateInput = {
    id?: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
    scene: SceneCreateNestedOneWithoutEntitiesInput
    entity: EntityCreateNestedOneWithoutScenesInput
  }

  export type SceneEntityUncheckedCreateInput = {
    id?: string
    sceneId: string
    entityId: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SceneEntityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scene?: SceneUpdateOneRequiredWithoutEntitiesNestedInput
    entity?: EntityUpdateOneRequiredWithoutScenesNestedInput
  }

  export type SceneEntityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sceneId?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityCreateManyInput = {
    id?: string
    sceneId: string
    entityId: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SceneEntityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sceneId?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type EntityListRelationFilter = {
    every?: EntityWhereInput
    some?: EntityWhereInput
    none?: EntityWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EntityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumEntityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeFilter<$PrismaModel> | $Enums.EntityType
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type SceneEntityListRelationFilter = {
    every?: SceneEntityWhereInput
    some?: SceneEntityWhereInput
    none?: SceneEntityWhereInput
  }

  export type SceneEntityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EntityCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    attributes?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EntityMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EntityMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumEntityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeWithAggregatesFilter<$PrismaModel> | $Enums.EntityType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEntityTypeFilter<$PrismaModel>
    _max?: NestedEnumEntityTypeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SceneListRelationFilter = {
    every?: SceneWhereInput
    some?: SceneWhereInput
    none?: SceneWhereInput
  }

  export type SceneOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    title?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DocumentScalarRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type SceneCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    startOffset?: SortOrder
    endOffset?: SortOrder
    metadata?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SceneAvgOrderByAggregateInput = {
    startOffset?: SortOrder
    endOffset?: SortOrder
    order?: SortOrder
  }

  export type SceneMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    startOffset?: SortOrder
    endOffset?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SceneMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    startOffset?: SortOrder
    endOffset?: SortOrder
    order?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SceneSumOrderByAggregateInput = {
    startOffset?: SortOrder
    endOffset?: SortOrder
    order?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SceneScalarRelationFilter = {
    is?: SceneWhereInput
    isNot?: SceneWhereInput
  }

  export type EntityScalarRelationFilter = {
    is?: EntityWhereInput
    isNot?: EntityWhereInput
  }

  export type SceneEntitySceneIdEntityIdCompoundUniqueInput = {
    sceneId: string
    entityId: string
  }

  export type SceneEntityCountOrderByAggregateInput = {
    id?: SortOrder
    sceneId?: SortOrder
    entityId?: SortOrder
    role?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type SceneEntityMaxOrderByAggregateInput = {
    id?: SortOrder
    sceneId?: SortOrder
    entityId?: SortOrder
    role?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type SceneEntityMinOrderByAggregateInput = {
    id?: SortOrder
    sceneId?: SortOrder
    entityId?: SortOrder
    role?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type DocumentCreateNestedManyWithoutProjectInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type EntityCreateNestedManyWithoutProjectInput = {
    create?: XOR<EntityCreateWithoutProjectInput, EntityUncheckedCreateWithoutProjectInput> | EntityCreateWithoutProjectInput[] | EntityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: EntityCreateOrConnectWithoutProjectInput | EntityCreateOrConnectWithoutProjectInput[]
    createMany?: EntityCreateManyProjectInputEnvelope
    connect?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type EntityUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<EntityCreateWithoutProjectInput, EntityUncheckedCreateWithoutProjectInput> | EntityCreateWithoutProjectInput[] | EntityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: EntityCreateOrConnectWithoutProjectInput | EntityCreateOrConnectWithoutProjectInput[]
    createMany?: EntityCreateManyProjectInputEnvelope
    connect?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DocumentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutProjectInput | DocumentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutProjectInput | DocumentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutProjectInput | DocumentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type EntityUpdateManyWithoutProjectNestedInput = {
    create?: XOR<EntityCreateWithoutProjectInput, EntityUncheckedCreateWithoutProjectInput> | EntityCreateWithoutProjectInput[] | EntityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: EntityCreateOrConnectWithoutProjectInput | EntityCreateOrConnectWithoutProjectInput[]
    upsert?: EntityUpsertWithWhereUniqueWithoutProjectInput | EntityUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: EntityCreateManyProjectInputEnvelope
    set?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    disconnect?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    delete?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    connect?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    update?: EntityUpdateWithWhereUniqueWithoutProjectInput | EntityUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: EntityUpdateManyWithWhereWithoutProjectInput | EntityUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: EntityScalarWhereInput | EntityScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutProjectInput | DocumentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutProjectInput | DocumentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutProjectInput | DocumentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type EntityUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<EntityCreateWithoutProjectInput, EntityUncheckedCreateWithoutProjectInput> | EntityCreateWithoutProjectInput[] | EntityUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: EntityCreateOrConnectWithoutProjectInput | EntityCreateOrConnectWithoutProjectInput[]
    upsert?: EntityUpsertWithWhereUniqueWithoutProjectInput | EntityUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: EntityCreateManyProjectInputEnvelope
    set?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    disconnect?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    delete?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    connect?: EntityWhereUniqueInput | EntityWhereUniqueInput[]
    update?: EntityUpdateWithWhereUniqueWithoutProjectInput | EntityUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: EntityUpdateManyWithWhereWithoutProjectInput | EntityUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: EntityScalarWhereInput | EntityScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutEntitiesInput = {
    create?: XOR<ProjectCreateWithoutEntitiesInput, ProjectUncheckedCreateWithoutEntitiesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutEntitiesInput
    connect?: ProjectWhereUniqueInput
  }

  export type SceneEntityCreateNestedManyWithoutEntityInput = {
    create?: XOR<SceneEntityCreateWithoutEntityInput, SceneEntityUncheckedCreateWithoutEntityInput> | SceneEntityCreateWithoutEntityInput[] | SceneEntityUncheckedCreateWithoutEntityInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutEntityInput | SceneEntityCreateOrConnectWithoutEntityInput[]
    createMany?: SceneEntityCreateManyEntityInputEnvelope
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
  }

  export type SceneEntityUncheckedCreateNestedManyWithoutEntityInput = {
    create?: XOR<SceneEntityCreateWithoutEntityInput, SceneEntityUncheckedCreateWithoutEntityInput> | SceneEntityCreateWithoutEntityInput[] | SceneEntityUncheckedCreateWithoutEntityInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutEntityInput | SceneEntityCreateOrConnectWithoutEntityInput[]
    createMany?: SceneEntityCreateManyEntityInputEnvelope
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
  }

  export type EnumEntityTypeFieldUpdateOperationsInput = {
    set?: $Enums.EntityType
  }

  export type ProjectUpdateOneRequiredWithoutEntitiesNestedInput = {
    create?: XOR<ProjectCreateWithoutEntitiesInput, ProjectUncheckedCreateWithoutEntitiesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutEntitiesInput
    upsert?: ProjectUpsertWithoutEntitiesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutEntitiesInput, ProjectUpdateWithoutEntitiesInput>, ProjectUncheckedUpdateWithoutEntitiesInput>
  }

  export type SceneEntityUpdateManyWithoutEntityNestedInput = {
    create?: XOR<SceneEntityCreateWithoutEntityInput, SceneEntityUncheckedCreateWithoutEntityInput> | SceneEntityCreateWithoutEntityInput[] | SceneEntityUncheckedCreateWithoutEntityInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutEntityInput | SceneEntityCreateOrConnectWithoutEntityInput[]
    upsert?: SceneEntityUpsertWithWhereUniqueWithoutEntityInput | SceneEntityUpsertWithWhereUniqueWithoutEntityInput[]
    createMany?: SceneEntityCreateManyEntityInputEnvelope
    set?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    disconnect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    delete?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    update?: SceneEntityUpdateWithWhereUniqueWithoutEntityInput | SceneEntityUpdateWithWhereUniqueWithoutEntityInput[]
    updateMany?: SceneEntityUpdateManyWithWhereWithoutEntityInput | SceneEntityUpdateManyWithWhereWithoutEntityInput[]
    deleteMany?: SceneEntityScalarWhereInput | SceneEntityScalarWhereInput[]
  }

  export type SceneEntityUncheckedUpdateManyWithoutEntityNestedInput = {
    create?: XOR<SceneEntityCreateWithoutEntityInput, SceneEntityUncheckedCreateWithoutEntityInput> | SceneEntityCreateWithoutEntityInput[] | SceneEntityUncheckedCreateWithoutEntityInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutEntityInput | SceneEntityCreateOrConnectWithoutEntityInput[]
    upsert?: SceneEntityUpsertWithWhereUniqueWithoutEntityInput | SceneEntityUpsertWithWhereUniqueWithoutEntityInput[]
    createMany?: SceneEntityCreateManyEntityInputEnvelope
    set?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    disconnect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    delete?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    update?: SceneEntityUpdateWithWhereUniqueWithoutEntityInput | SceneEntityUpdateWithWhereUniqueWithoutEntityInput[]
    updateMany?: SceneEntityUpdateManyWithWhereWithoutEntityInput | SceneEntityUpdateManyWithWhereWithoutEntityInput[]
    deleteMany?: SceneEntityScalarWhereInput | SceneEntityScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDocumentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type SceneCreateNestedManyWithoutDocumentInput = {
    create?: XOR<SceneCreateWithoutDocumentInput, SceneUncheckedCreateWithoutDocumentInput> | SceneCreateWithoutDocumentInput[] | SceneUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: SceneCreateOrConnectWithoutDocumentInput | SceneCreateOrConnectWithoutDocumentInput[]
    createMany?: SceneCreateManyDocumentInputEnvelope
    connect?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
  }

  export type SceneUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<SceneCreateWithoutDocumentInput, SceneUncheckedCreateWithoutDocumentInput> | SceneCreateWithoutDocumentInput[] | SceneUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: SceneCreateOrConnectWithoutDocumentInput | SceneCreateOrConnectWithoutDocumentInput[]
    createMany?: SceneCreateManyDocumentInputEnvelope
    connect?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDocumentsInput
    upsert?: ProjectUpsertWithoutDocumentsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutDocumentsInput, ProjectUpdateWithoutDocumentsInput>, ProjectUncheckedUpdateWithoutDocumentsInput>
  }

  export type SceneUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<SceneCreateWithoutDocumentInput, SceneUncheckedCreateWithoutDocumentInput> | SceneCreateWithoutDocumentInput[] | SceneUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: SceneCreateOrConnectWithoutDocumentInput | SceneCreateOrConnectWithoutDocumentInput[]
    upsert?: SceneUpsertWithWhereUniqueWithoutDocumentInput | SceneUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: SceneCreateManyDocumentInputEnvelope
    set?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    disconnect?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    delete?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    connect?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    update?: SceneUpdateWithWhereUniqueWithoutDocumentInput | SceneUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: SceneUpdateManyWithWhereWithoutDocumentInput | SceneUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: SceneScalarWhereInput | SceneScalarWhereInput[]
  }

  export type SceneUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<SceneCreateWithoutDocumentInput, SceneUncheckedCreateWithoutDocumentInput> | SceneCreateWithoutDocumentInput[] | SceneUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: SceneCreateOrConnectWithoutDocumentInput | SceneCreateOrConnectWithoutDocumentInput[]
    upsert?: SceneUpsertWithWhereUniqueWithoutDocumentInput | SceneUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: SceneCreateManyDocumentInputEnvelope
    set?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    disconnect?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    delete?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    connect?: SceneWhereUniqueInput | SceneWhereUniqueInput[]
    update?: SceneUpdateWithWhereUniqueWithoutDocumentInput | SceneUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: SceneUpdateManyWithWhereWithoutDocumentInput | SceneUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: SceneScalarWhereInput | SceneScalarWhereInput[]
  }

  export type DocumentCreateNestedOneWithoutScenesInput = {
    create?: XOR<DocumentCreateWithoutScenesInput, DocumentUncheckedCreateWithoutScenesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutScenesInput
    connect?: DocumentWhereUniqueInput
  }

  export type SceneEntityCreateNestedManyWithoutSceneInput = {
    create?: XOR<SceneEntityCreateWithoutSceneInput, SceneEntityUncheckedCreateWithoutSceneInput> | SceneEntityCreateWithoutSceneInput[] | SceneEntityUncheckedCreateWithoutSceneInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutSceneInput | SceneEntityCreateOrConnectWithoutSceneInput[]
    createMany?: SceneEntityCreateManySceneInputEnvelope
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
  }

  export type SceneEntityUncheckedCreateNestedManyWithoutSceneInput = {
    create?: XOR<SceneEntityCreateWithoutSceneInput, SceneEntityUncheckedCreateWithoutSceneInput> | SceneEntityCreateWithoutSceneInput[] | SceneEntityUncheckedCreateWithoutSceneInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutSceneInput | SceneEntityCreateOrConnectWithoutSceneInput[]
    createMany?: SceneEntityCreateManySceneInputEnvelope
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DocumentUpdateOneRequiredWithoutScenesNestedInput = {
    create?: XOR<DocumentCreateWithoutScenesInput, DocumentUncheckedCreateWithoutScenesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutScenesInput
    upsert?: DocumentUpsertWithoutScenesInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutScenesInput, DocumentUpdateWithoutScenesInput>, DocumentUncheckedUpdateWithoutScenesInput>
  }

  export type SceneEntityUpdateManyWithoutSceneNestedInput = {
    create?: XOR<SceneEntityCreateWithoutSceneInput, SceneEntityUncheckedCreateWithoutSceneInput> | SceneEntityCreateWithoutSceneInput[] | SceneEntityUncheckedCreateWithoutSceneInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutSceneInput | SceneEntityCreateOrConnectWithoutSceneInput[]
    upsert?: SceneEntityUpsertWithWhereUniqueWithoutSceneInput | SceneEntityUpsertWithWhereUniqueWithoutSceneInput[]
    createMany?: SceneEntityCreateManySceneInputEnvelope
    set?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    disconnect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    delete?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    update?: SceneEntityUpdateWithWhereUniqueWithoutSceneInput | SceneEntityUpdateWithWhereUniqueWithoutSceneInput[]
    updateMany?: SceneEntityUpdateManyWithWhereWithoutSceneInput | SceneEntityUpdateManyWithWhereWithoutSceneInput[]
    deleteMany?: SceneEntityScalarWhereInput | SceneEntityScalarWhereInput[]
  }

  export type SceneEntityUncheckedUpdateManyWithoutSceneNestedInput = {
    create?: XOR<SceneEntityCreateWithoutSceneInput, SceneEntityUncheckedCreateWithoutSceneInput> | SceneEntityCreateWithoutSceneInput[] | SceneEntityUncheckedCreateWithoutSceneInput[]
    connectOrCreate?: SceneEntityCreateOrConnectWithoutSceneInput | SceneEntityCreateOrConnectWithoutSceneInput[]
    upsert?: SceneEntityUpsertWithWhereUniqueWithoutSceneInput | SceneEntityUpsertWithWhereUniqueWithoutSceneInput[]
    createMany?: SceneEntityCreateManySceneInputEnvelope
    set?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    disconnect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    delete?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    connect?: SceneEntityWhereUniqueInput | SceneEntityWhereUniqueInput[]
    update?: SceneEntityUpdateWithWhereUniqueWithoutSceneInput | SceneEntityUpdateWithWhereUniqueWithoutSceneInput[]
    updateMany?: SceneEntityUpdateManyWithWhereWithoutSceneInput | SceneEntityUpdateManyWithWhereWithoutSceneInput[]
    deleteMany?: SceneEntityScalarWhereInput | SceneEntityScalarWhereInput[]
  }

  export type SceneCreateNestedOneWithoutEntitiesInput = {
    create?: XOR<SceneCreateWithoutEntitiesInput, SceneUncheckedCreateWithoutEntitiesInput>
    connectOrCreate?: SceneCreateOrConnectWithoutEntitiesInput
    connect?: SceneWhereUniqueInput
  }

  export type EntityCreateNestedOneWithoutScenesInput = {
    create?: XOR<EntityCreateWithoutScenesInput, EntityUncheckedCreateWithoutScenesInput>
    connectOrCreate?: EntityCreateOrConnectWithoutScenesInput
    connect?: EntityWhereUniqueInput
  }

  export type SceneUpdateOneRequiredWithoutEntitiesNestedInput = {
    create?: XOR<SceneCreateWithoutEntitiesInput, SceneUncheckedCreateWithoutEntitiesInput>
    connectOrCreate?: SceneCreateOrConnectWithoutEntitiesInput
    upsert?: SceneUpsertWithoutEntitiesInput
    connect?: SceneWhereUniqueInput
    update?: XOR<XOR<SceneUpdateToOneWithWhereWithoutEntitiesInput, SceneUpdateWithoutEntitiesInput>, SceneUncheckedUpdateWithoutEntitiesInput>
  }

  export type EntityUpdateOneRequiredWithoutScenesNestedInput = {
    create?: XOR<EntityCreateWithoutScenesInput, EntityUncheckedCreateWithoutScenesInput>
    connectOrCreate?: EntityCreateOrConnectWithoutScenesInput
    upsert?: EntityUpsertWithoutScenesInput
    connect?: EntityWhereUniqueInput
    update?: XOR<XOR<EntityUpdateToOneWithWhereWithoutScenesInput, EntityUpdateWithoutScenesInput>, EntityUncheckedUpdateWithoutScenesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumEntityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeFilter<$PrismaModel> | $Enums.EntityType
  }

  export type NestedEnumEntityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EntityType | EnumEntityTypeFieldRefInput<$PrismaModel>
    in?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.EntityType[] | ListEnumEntityTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumEntityTypeWithAggregatesFilter<$PrismaModel> | $Enums.EntityType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEntityTypeFilter<$PrismaModel>
    _max?: NestedEnumEntityTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DocumentCreateWithoutProjectInput = {
    id?: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    scenes?: SceneCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutProjectInput = {
    id?: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    scenes?: SceneUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutProjectInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput>
  }

  export type DocumentCreateManyProjectInputEnvelope = {
    data: DocumentCreateManyProjectInput | DocumentCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type EntityCreateWithoutProjectInput = {
    id?: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scenes?: SceneEntityCreateNestedManyWithoutEntityInput
  }

  export type EntityUncheckedCreateWithoutProjectInput = {
    id?: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scenes?: SceneEntityUncheckedCreateNestedManyWithoutEntityInput
  }

  export type EntityCreateOrConnectWithoutProjectInput = {
    where: EntityWhereUniqueInput
    create: XOR<EntityCreateWithoutProjectInput, EntityUncheckedCreateWithoutProjectInput>
  }

  export type EntityCreateManyProjectInputEnvelope = {
    data: EntityCreateManyProjectInput | EntityCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type DocumentUpsertWithWhereUniqueWithoutProjectInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutProjectInput, DocumentUncheckedUpdateWithoutProjectInput>
    create: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutProjectInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutProjectInput, DocumentUncheckedUpdateWithoutProjectInput>
  }

  export type DocumentUpdateManyWithWhereWithoutProjectInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutProjectInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: StringFilter<"Document"> | string
    projectId?: StringFilter<"Document"> | string
    title?: StringFilter<"Document"> | string
    content?: JsonFilter<"Document">
    order?: IntFilter<"Document"> | number
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type EntityUpsertWithWhereUniqueWithoutProjectInput = {
    where: EntityWhereUniqueInput
    update: XOR<EntityUpdateWithoutProjectInput, EntityUncheckedUpdateWithoutProjectInput>
    create: XOR<EntityCreateWithoutProjectInput, EntityUncheckedCreateWithoutProjectInput>
  }

  export type EntityUpdateWithWhereUniqueWithoutProjectInput = {
    where: EntityWhereUniqueInput
    data: XOR<EntityUpdateWithoutProjectInput, EntityUncheckedUpdateWithoutProjectInput>
  }

  export type EntityUpdateManyWithWhereWithoutProjectInput = {
    where: EntityScalarWhereInput
    data: XOR<EntityUpdateManyMutationInput, EntityUncheckedUpdateManyWithoutProjectInput>
  }

  export type EntityScalarWhereInput = {
    AND?: EntityScalarWhereInput | EntityScalarWhereInput[]
    OR?: EntityScalarWhereInput[]
    NOT?: EntityScalarWhereInput | EntityScalarWhereInput[]
    id?: StringFilter<"Entity"> | string
    projectId?: StringFilter<"Entity"> | string
    type?: EnumEntityTypeFilter<"Entity"> | $Enums.EntityType
    name?: StringFilter<"Entity"> | string
    description?: StringNullableFilter<"Entity"> | string | null
    attributes?: JsonFilter<"Entity">
    imageUrl?: StringNullableFilter<"Entity"> | string | null
    createdAt?: DateTimeFilter<"Entity"> | Date | string
    updatedAt?: DateTimeFilter<"Entity"> | Date | string
  }

  export type ProjectCreateWithoutEntitiesInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutEntitiesInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutEntitiesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutEntitiesInput, ProjectUncheckedCreateWithoutEntitiesInput>
  }

  export type SceneEntityCreateWithoutEntityInput = {
    id?: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
    scene: SceneCreateNestedOneWithoutEntitiesInput
  }

  export type SceneEntityUncheckedCreateWithoutEntityInput = {
    id?: string
    sceneId: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SceneEntityCreateOrConnectWithoutEntityInput = {
    where: SceneEntityWhereUniqueInput
    create: XOR<SceneEntityCreateWithoutEntityInput, SceneEntityUncheckedCreateWithoutEntityInput>
  }

  export type SceneEntityCreateManyEntityInputEnvelope = {
    data: SceneEntityCreateManyEntityInput | SceneEntityCreateManyEntityInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutEntitiesInput = {
    update: XOR<ProjectUpdateWithoutEntitiesInput, ProjectUncheckedUpdateWithoutEntitiesInput>
    create: XOR<ProjectCreateWithoutEntitiesInput, ProjectUncheckedCreateWithoutEntitiesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutEntitiesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutEntitiesInput, ProjectUncheckedUpdateWithoutEntitiesInput>
  }

  export type ProjectUpdateWithoutEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type SceneEntityUpsertWithWhereUniqueWithoutEntityInput = {
    where: SceneEntityWhereUniqueInput
    update: XOR<SceneEntityUpdateWithoutEntityInput, SceneEntityUncheckedUpdateWithoutEntityInput>
    create: XOR<SceneEntityCreateWithoutEntityInput, SceneEntityUncheckedCreateWithoutEntityInput>
  }

  export type SceneEntityUpdateWithWhereUniqueWithoutEntityInput = {
    where: SceneEntityWhereUniqueInput
    data: XOR<SceneEntityUpdateWithoutEntityInput, SceneEntityUncheckedUpdateWithoutEntityInput>
  }

  export type SceneEntityUpdateManyWithWhereWithoutEntityInput = {
    where: SceneEntityScalarWhereInput
    data: XOR<SceneEntityUpdateManyMutationInput, SceneEntityUncheckedUpdateManyWithoutEntityInput>
  }

  export type SceneEntityScalarWhereInput = {
    AND?: SceneEntityScalarWhereInput | SceneEntityScalarWhereInput[]
    OR?: SceneEntityScalarWhereInput[]
    NOT?: SceneEntityScalarWhereInput | SceneEntityScalarWhereInput[]
    id?: StringFilter<"SceneEntity"> | string
    sceneId?: StringFilter<"SceneEntity"> | string
    entityId?: StringFilter<"SceneEntity"> | string
    role?: StringNullableFilter<"SceneEntity"> | string | null
    notes?: StringNullableFilter<"SceneEntity"> | string | null
    createdAt?: DateTimeFilter<"SceneEntity"> | Date | string
  }

  export type ProjectCreateWithoutDocumentsInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    entities?: EntityCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDocumentsInput = {
    id?: string
    title: string
    description?: string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    entities?: EntityUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDocumentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
  }

  export type SceneCreateWithoutDocumentInput = {
    id?: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    entities?: SceneEntityCreateNestedManyWithoutSceneInput
  }

  export type SceneUncheckedCreateWithoutDocumentInput = {
    id?: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    entities?: SceneEntityUncheckedCreateNestedManyWithoutSceneInput
  }

  export type SceneCreateOrConnectWithoutDocumentInput = {
    where: SceneWhereUniqueInput
    create: XOR<SceneCreateWithoutDocumentInput, SceneUncheckedCreateWithoutDocumentInput>
  }

  export type SceneCreateManyDocumentInputEnvelope = {
    data: SceneCreateManyDocumentInput | SceneCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutDocumentsInput = {
    update: XOR<ProjectUpdateWithoutDocumentsInput, ProjectUncheckedUpdateWithoutDocumentsInput>
    create: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutDocumentsInput, ProjectUncheckedUpdateWithoutDocumentsInput>
  }

  export type ProjectUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entities?: EntityUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entities?: EntityUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type SceneUpsertWithWhereUniqueWithoutDocumentInput = {
    where: SceneWhereUniqueInput
    update: XOR<SceneUpdateWithoutDocumentInput, SceneUncheckedUpdateWithoutDocumentInput>
    create: XOR<SceneCreateWithoutDocumentInput, SceneUncheckedCreateWithoutDocumentInput>
  }

  export type SceneUpdateWithWhereUniqueWithoutDocumentInput = {
    where: SceneWhereUniqueInput
    data: XOR<SceneUpdateWithoutDocumentInput, SceneUncheckedUpdateWithoutDocumentInput>
  }

  export type SceneUpdateManyWithWhereWithoutDocumentInput = {
    where: SceneScalarWhereInput
    data: XOR<SceneUpdateManyMutationInput, SceneUncheckedUpdateManyWithoutDocumentInput>
  }

  export type SceneScalarWhereInput = {
    AND?: SceneScalarWhereInput | SceneScalarWhereInput[]
    OR?: SceneScalarWhereInput[]
    NOT?: SceneScalarWhereInput | SceneScalarWhereInput[]
    id?: StringFilter<"Scene"> | string
    documentId?: StringFilter<"Scene"> | string
    title?: StringNullableFilter<"Scene"> | string | null
    summary?: StringNullableFilter<"Scene"> | string | null
    startOffset?: IntNullableFilter<"Scene"> | number | null
    endOffset?: IntNullableFilter<"Scene"> | number | null
    metadata?: JsonFilter<"Scene">
    order?: IntFilter<"Scene"> | number
    createdAt?: DateTimeFilter<"Scene"> | Date | string
    updatedAt?: DateTimeFilter<"Scene"> | Date | string
  }

  export type DocumentCreateWithoutScenesInput = {
    id?: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateWithoutScenesInput = {
    id?: string
    projectId: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutScenesInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutScenesInput, DocumentUncheckedCreateWithoutScenesInput>
  }

  export type SceneEntityCreateWithoutSceneInput = {
    id?: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
    entity: EntityCreateNestedOneWithoutScenesInput
  }

  export type SceneEntityUncheckedCreateWithoutSceneInput = {
    id?: string
    entityId: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SceneEntityCreateOrConnectWithoutSceneInput = {
    where: SceneEntityWhereUniqueInput
    create: XOR<SceneEntityCreateWithoutSceneInput, SceneEntityUncheckedCreateWithoutSceneInput>
  }

  export type SceneEntityCreateManySceneInputEnvelope = {
    data: SceneEntityCreateManySceneInput | SceneEntityCreateManySceneInput[]
    skipDuplicates?: boolean
  }

  export type DocumentUpsertWithoutScenesInput = {
    update: XOR<DocumentUpdateWithoutScenesInput, DocumentUncheckedUpdateWithoutScenesInput>
    create: XOR<DocumentCreateWithoutScenesInput, DocumentUncheckedCreateWithoutScenesInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutScenesInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutScenesInput, DocumentUncheckedUpdateWithoutScenesInput>
  }

  export type DocumentUpdateWithoutScenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateWithoutScenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityUpsertWithWhereUniqueWithoutSceneInput = {
    where: SceneEntityWhereUniqueInput
    update: XOR<SceneEntityUpdateWithoutSceneInput, SceneEntityUncheckedUpdateWithoutSceneInput>
    create: XOR<SceneEntityCreateWithoutSceneInput, SceneEntityUncheckedCreateWithoutSceneInput>
  }

  export type SceneEntityUpdateWithWhereUniqueWithoutSceneInput = {
    where: SceneEntityWhereUniqueInput
    data: XOR<SceneEntityUpdateWithoutSceneInput, SceneEntityUncheckedUpdateWithoutSceneInput>
  }

  export type SceneEntityUpdateManyWithWhereWithoutSceneInput = {
    where: SceneEntityScalarWhereInput
    data: XOR<SceneEntityUpdateManyMutationInput, SceneEntityUncheckedUpdateManyWithoutSceneInput>
  }

  export type SceneCreateWithoutEntitiesInput = {
    id?: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutScenesInput
  }

  export type SceneUncheckedCreateWithoutEntitiesInput = {
    id?: string
    documentId: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SceneCreateOrConnectWithoutEntitiesInput = {
    where: SceneWhereUniqueInput
    create: XOR<SceneCreateWithoutEntitiesInput, SceneUncheckedCreateWithoutEntitiesInput>
  }

  export type EntityCreateWithoutScenesInput = {
    id?: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutEntitiesInput
  }

  export type EntityUncheckedCreateWithoutScenesInput = {
    id?: string
    projectId: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EntityCreateOrConnectWithoutScenesInput = {
    where: EntityWhereUniqueInput
    create: XOR<EntityCreateWithoutScenesInput, EntityUncheckedCreateWithoutScenesInput>
  }

  export type SceneUpsertWithoutEntitiesInput = {
    update: XOR<SceneUpdateWithoutEntitiesInput, SceneUncheckedUpdateWithoutEntitiesInput>
    create: XOR<SceneCreateWithoutEntitiesInput, SceneUncheckedCreateWithoutEntitiesInput>
    where?: SceneWhereInput
  }

  export type SceneUpdateToOneWithWhereWithoutEntitiesInput = {
    where?: SceneWhereInput
    data: XOR<SceneUpdateWithoutEntitiesInput, SceneUncheckedUpdateWithoutEntitiesInput>
  }

  export type SceneUpdateWithoutEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutScenesNestedInput
  }

  export type SceneUncheckedUpdateWithoutEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    documentId?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityUpsertWithoutScenesInput = {
    update: XOR<EntityUpdateWithoutScenesInput, EntityUncheckedUpdateWithoutScenesInput>
    create: XOR<EntityCreateWithoutScenesInput, EntityUncheckedCreateWithoutScenesInput>
    where?: EntityWhereInput
  }

  export type EntityUpdateToOneWithWhereWithoutScenesInput = {
    where?: EntityWhereInput
    data: XOR<EntityUpdateWithoutScenesInput, EntityUncheckedUpdateWithoutScenesInput>
  }

  export type EntityUpdateWithoutScenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutEntitiesNestedInput
  }

  export type EntityUncheckedUpdateWithoutScenesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyProjectInput = {
    id?: string
    title: string
    content?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EntityCreateManyProjectInput = {
    id?: string
    type: $Enums.EntityType
    name: string
    description?: string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenes?: SceneUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenes?: SceneUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EntityUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenes?: SceneEntityUpdateManyWithoutEntityNestedInput
  }

  export type EntityUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scenes?: SceneEntityUncheckedUpdateManyWithoutEntityNestedInput
  }

  export type EntityUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumEntityTypeFieldUpdateOperationsInput | $Enums.EntityType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    attributes?: JsonNullValueInput | InputJsonValue
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityCreateManyEntityInput = {
    id?: string
    sceneId: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SceneEntityUpdateWithoutEntityInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scene?: SceneUpdateOneRequiredWithoutEntitiesNestedInput
  }

  export type SceneEntityUncheckedUpdateWithoutEntityInput = {
    id?: StringFieldUpdateOperationsInput | string
    sceneId?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityUncheckedUpdateManyWithoutEntityInput = {
    id?: StringFieldUpdateOperationsInput | string
    sceneId?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneCreateManyDocumentInput = {
    id?: string
    title?: string | null
    summary?: string | null
    startOffset?: number | null
    endOffset?: number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SceneUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entities?: SceneEntityUpdateManyWithoutSceneNestedInput
  }

  export type SceneUncheckedUpdateWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entities?: SceneEntityUncheckedUpdateManyWithoutSceneNestedInput
  }

  export type SceneUncheckedUpdateManyWithoutDocumentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    startOffset?: NullableIntFieldUpdateOperationsInput | number | null
    endOffset?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: JsonNullValueInput | InputJsonValue
    order?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityCreateManySceneInput = {
    id?: string
    entityId: string
    role?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type SceneEntityUpdateWithoutSceneInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entity?: EntityUpdateOneRequiredWithoutScenesNestedInput
  }

  export type SceneEntityUncheckedUpdateWithoutSceneInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SceneEntityUncheckedUpdateManyWithoutSceneInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}