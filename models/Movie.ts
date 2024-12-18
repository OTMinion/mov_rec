import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    type: String,
    key: String,
    site: String,
    name: String,
  },
  { _id: false }
);

// Add KeywordSchema
const KeywordSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  originalTitle: String,
  releaseDate: Date,
  status: String,
  overview: String,
  tagline: String,
  runtime: Number,
  popularity: Number,
  voteAverage: Number,
  voteCount: Number,
  budget: Number,
  revenue: Number,
  posterPath: String,
  backdropPath: String,
  images: {
    posters: [String],
    backdrops: [String],
  },
  videos: [VideoSchema],
  genres: [
    {
      id: Number,
      name: String,
    },
  ],
  keywords: [KeywordSchema], // Changed from [String] to [KeywordSchema]
  contentRatings: {
    type: Map,
    of: [String],
  },
  alternativeTitles: [
    {
      iso_3166_1: String,
      title: String,
      type: String,
    },
  ],
  originalLanguage: String,
  spokenLanguages: [
    {
      english_name: String,
      iso_639_1: String,
      name: String,
    },
  ],
  productionCompanies: [
    {
      id: Number,
      name: String,
      origin_country: String,
      logo_path: String,
    },
  ],
  productionCountries: [
    {
      iso_3166_1: String,
      name: String,
    },
  ],
  credits: {
    cast: [
      {
        id: Number,
        name: String,
        character: String,
        order: Number,
      },
    ],
    crew: [
      {
        id: Number,
        name: String,
        job: String,
        department: String,
      },
    ],
  },
  streamingProviders: mongoose.Schema.Types.Mixed,
  lastUpdated: { type: Date, default: Date.now },
});

// Create indexes for better query performance
MovieSchema.index({ title: 1 });
MovieSchema.index({ popularity: -1 });
MovieSchema.index({ releaseDate: -1 });
MovieSchema.index({ voteAverage: -1 });

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
