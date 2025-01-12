/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface MigratorInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "MIGRATE_RATE"
      | "disableMigration"
      | "enableMigration"
      | "gfToken"
      | "migrate"
      | "migrationEnabled"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
      | "zentryToken"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Migrated" | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "MIGRATE_RATE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "disableMigration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enableMigration",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "gfToken", values?: undefined): string;
  encodeFunctionData(functionFragment: "migrate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "migrationEnabled",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "zentryToken",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "MIGRATE_RATE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disableMigration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enableMigration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gfToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "migrate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "migrationEnabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "zentryToken",
    data: BytesLike
  ): Result;
}

export namespace MigratedEvent {
  export type InputTuple = [
    migrant: AddressLike,
    destinationAmount: BigNumberish
  ];
  export type OutputTuple = [migrant: string, destinationAmount: bigint];
  export interface OutputObject {
    migrant: string;
    destinationAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Migrator extends BaseContract {
  connect(runner?: ContractRunner | null): Migrator;
  waitForDeployment(): Promise<this>;

  interface: MigratorInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  MIGRATE_RATE: TypedContractMethod<[], [bigint], "view">;

  disableMigration: TypedContractMethod<[], [void], "nonpayable">;

  enableMigration: TypedContractMethod<[], [void], "nonpayable">;

  gfToken: TypedContractMethod<[], [string], "view">;

  migrate: TypedContractMethod<[], [void], "nonpayable">;

  migrationEnabled: TypedContractMethod<[], [boolean], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  zentryToken: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "MIGRATE_RATE"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "disableMigration"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "enableMigration"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "gfToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "migrate"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "migrationEnabled"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "zentryToken"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "Migrated"
  ): TypedContractEvent<
    MigratedEvent.InputTuple,
    MigratedEvent.OutputTuple,
    MigratedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "Migrated(address,uint256)": TypedContractEvent<
      MigratedEvent.InputTuple,
      MigratedEvent.OutputTuple,
      MigratedEvent.OutputObject
    >;
    Migrated: TypedContractEvent<
      MigratedEvent.InputTuple,
      MigratedEvent.OutputTuple,
      MigratedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
