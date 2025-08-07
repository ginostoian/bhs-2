import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Partner from "@/models/Partner";
import PartnersClient from "./components/PartnersClient";

export default async function AdminPartnersPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const partners = await Partner.find({})
    .sort({ name: 1 })
    .lean()
    .then((docs) =>
      docs.map((doc) => ({ ...doc, id: doc._id.toString(), _id: undefined })),
    );

  const occupations = await Partner.distinct("occupation");
  const experiences = ["Bad", "Good", "Great"];

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Partners Database
        </h2>
        <p className="text-gray-600">Manage partners and their referrals</p>
      </div>

      <PartnersClient
        partners={partners}
        occupations={occupations}
        experiences={experiences}
      />
    </div>
  );
}
