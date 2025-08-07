import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Contractor from "@/models/Contractor";
import ContractorsClient from "./components/ContractorsClient";

export default async function AdminContractorsPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  // Prefetch initial contractors list
  const contractors = await Contractor.find({})
    .sort({ name: 1 })
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
      })),
    );

  // Distinct facets for filters
  const trades = await Contractor.distinct("trades");
  const priceTiers = ["£", "££", "£££", "££££"];
  const experiences = ["Bad", "Good", "Great"];

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Contractor Database
        </h2>
        <p className="text-gray-600">
          Store and manage contractors for future projects
        </p>
      </div>

      <ContractorsClient
        contractors={contractors}
        trades={trades}
        priceTiers={priceTiers}
        experiences={experiences}
      />
    </div>
  );
}
