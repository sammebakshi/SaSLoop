package com.example.sasloopmanager;

import android.content.Context;
import android.widget.Toast;
import androidx.compose.foundation.BackgroundKt;
import androidx.compose.foundation.BorderKt;
import androidx.compose.foundation.BorderStroke;
import androidx.compose.foundation.BorderStrokeKt;
import androidx.compose.foundation.ClickableKt;
import androidx.compose.foundation.ScrollKt;
import androidx.compose.foundation.interaction.MutableInteractionSource;
import androidx.compose.foundation.layout.Arrangement;
import androidx.compose.foundation.layout.BoxKt;
import androidx.compose.foundation.layout.BoxScopeInstance;
import androidx.compose.foundation.layout.ColumnKt;
import androidx.compose.foundation.layout.ColumnScope;
import androidx.compose.foundation.layout.ColumnScopeInstance;
import androidx.compose.foundation.layout.PaddingKt;
import androidx.compose.foundation.layout.PaddingValues;
import androidx.compose.foundation.layout.RowKt;
import androidx.compose.foundation.layout.RowScope;
import androidx.compose.foundation.layout.RowScopeInstance;
import androidx.compose.foundation.layout.SizeKt;
import androidx.compose.foundation.layout.SpacerKt;
import androidx.compose.foundation.lazy.LazyDslKt;
import androidx.compose.foundation.lazy.LazyItemScope;
import androidx.compose.foundation.lazy.LazyListScope;
import androidx.compose.foundation.lazy.grid.LazyGridItemScope;
import androidx.compose.foundation.lazy.grid.LazyGridScope;
import androidx.compose.foundation.shape.CornerBasedShape;
import androidx.compose.foundation.shape.RoundedCornerShape;
import androidx.compose.foundation.shape.RoundedCornerShapeKt;
import androidx.compose.foundation.text.BasicTextFieldKt;
import androidx.compose.foundation.text.KeyboardActions;
import androidx.compose.foundation.text.KeyboardOptions;
import androidx.compose.material.MenuKt;
import androidx.compose.material.icons.Icons;
import androidx.compose.material.icons.filled.AccountBalanceWalletKt;
import androidx.compose.material.icons.filled.AppsKt;
import androidx.compose.material.icons.filled.ArrowBackKt;
import androidx.compose.material.icons.filled.BookmarkBorderKt;
import androidx.compose.material.icons.filled.CloseKt;
import androidx.compose.material.icons.filled.HistoryKt;
import androidx.compose.material.icons.filled.ListKt;
import androidx.compose.material.icons.filled.LocalOfferKt;
import androidx.compose.material.icons.filled.NoteAddKt;
import androidx.compose.material.icons.filled.PersonKt;
import androidx.compose.material.icons.filled.RedeemKt;
import androidx.compose.material.icons.filled.RestaurantKt;
import androidx.compose.material.icons.filled.RoomServiceKt;
import androidx.compose.material.icons.filled.SearchKt;
import androidx.compose.material.icons.filled.ShoppingCartKt;
import androidx.compose.material3.AndroidMenu_androidKt;
import androidx.compose.material3.ButtonColors;
import androidx.compose.material3.ButtonDefaults;
import androidx.compose.material3.ButtonKt;
import androidx.compose.material3.CardColors;
import androidx.compose.material3.CardDefaults;
import androidx.compose.material3.CardKt;
import androidx.compose.material3.ChipKt;
import androidx.compose.material3.DividerKt;
import androidx.compose.material3.FilterChipDefaults;
import androidx.compose.material3.IconButtonKt;
import androidx.compose.material3.IconKt;
import androidx.compose.material3.MaterialTheme;
import androidx.compose.material3.OutlinedTextFieldDefaults;
import androidx.compose.material3.OutlinedTextFieldKt;
import androidx.compose.material3.ProgressIndicatorKt;
import androidx.compose.material3.SurfaceKt;
import androidx.compose.material3.TabKt;
import androidx.compose.material3.TabRowKt;
import androidx.compose.material3.TextFieldColors;
import androidx.compose.material3.TextKt;
import androidx.compose.runtime.Applier;
import androidx.compose.runtime.ComposablesKt;
import androidx.compose.runtime.Composer;
import androidx.compose.runtime.ComposerKt;
import androidx.compose.runtime.CompositionLocalMap;
import androidx.compose.runtime.EffectsKt;
import androidx.compose.runtime.MutableState;
import androidx.compose.runtime.ProvidableCompositionLocal;
import androidx.compose.runtime.RecomposeScopeImplKt;
import androidx.compose.runtime.ScopeUpdateScope;
import androidx.compose.runtime.SnapshotStateKt__SnapshotStateKt;
import androidx.compose.runtime.State;
import androidx.compose.runtime.Updater;
import androidx.compose.runtime.internal.ComposableLambda;
import androidx.compose.runtime.internal.ComposableLambdaKt;
import androidx.compose.runtime.snapshots.SnapshotStateMap;
import androidx.compose.ui.Alignment;
import androidx.compose.ui.ComposedModifierKt;
import androidx.compose.ui.Modifier;
import androidx.compose.ui.draw.ClipKt;
import androidx.compose.ui.graphics.Brush;
import androidx.compose.ui.graphics.Color;
import androidx.compose.ui.graphics.Shadow;
import androidx.compose.ui.graphics.Shape;
import androidx.compose.ui.graphics.SolidColor;
import androidx.compose.ui.graphics.drawscope.DrawStyle;
import androidx.compose.ui.graphics.vector.ImageVector;
import androidx.compose.ui.layout.MeasurePolicy;
import androidx.compose.ui.node.ComposeUiNode;
import androidx.compose.ui.platform.AndroidCompositionLocals_androidKt;
import androidx.compose.ui.text.PlatformTextStyle;
import androidx.compose.ui.text.TextLayoutResult;
import androidx.compose.ui.text.TextStyle;
import androidx.compose.ui.text.font.FontFamily;
import androidx.compose.ui.text.font.FontStyle;
import androidx.compose.ui.text.font.FontSynthesis;
import androidx.compose.ui.text.font.FontWeight;
import androidx.compose.ui.text.input.VisualTransformation;
import androidx.compose.ui.text.intl.LocaleList;
import androidx.compose.ui.text.style.BaselineShift;
import androidx.compose.ui.text.style.LineHeightStyle;
import androidx.compose.ui.text.style.TextAlign;
import androidx.compose.ui.text.style.TextDecoration;
import androidx.compose.ui.text.style.TextGeometricTransform;
import androidx.compose.ui.text.style.TextIndent;
import androidx.compose.ui.text.style.TextMotion;
import androidx.compose.ui.text.style.TextOverflow;
import androidx.compose.ui.tooling.preview.AndroidUiModes;
import androidx.compose.ui.unit.Dp;
import androidx.compose.ui.unit.TextUnitKt;
import androidx.compose.ui.window.AndroidDialog_androidKt;
import androidx.core.app.NotificationCompat;
import androidx.core.view.accessibility.AccessibilityEventCompat;
import androidx.profileinstaller.ProfileVerifier;
import com.example.sasloopmanager.data.CategoryItem;
import com.example.sasloopmanager.data.CustomerHistoryResponse;
import com.example.sasloopmanager.data.CustomerOrderHistoryItem;
import com.example.sasloopmanager.data.CustomerTransactionHistoryItem;
import com.example.sasloopmanager.data.MenuItem;
import com.example.sasloopmanager.data.OptionGroup;
import com.example.sasloopmanager.data.OptionItem;
import com.example.sasloopmanager.data.Order;
import com.example.sasloopmanager.data.PosSettings;
import com.example.sasloopmanager.data.SearchedCustomer;
import com.example.sasloopmanager.data.SelectedModifier;
import com.example.sasloopmanager.data.StaffUser;
import com.example.sasloopmanager.data.TableItem;
import com.example.sasloopmanager.data.UserProfile;
import com.example.sasloopmanager.theme.ColorKt;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import kotlin.Metadata;
import kotlin.Triple;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.comparisons.ComparisonsKt;
import kotlin.coroutines.Continuation;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;
import kotlin.jvm.functions.Function4;
import kotlin.jvm.internal.DefaultConstructorMarker;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.StringCompanionObject;
import kotlin.ranges.RangesKt;
import kotlin.text.StringsKt;
import kotlinx.coroutines.CoroutineScope;

/* compiled from: BillingScreen.kt */
@Metadata(d1 = {"\u0000ê\u0001\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000b\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\t\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\r\n\u0002\u0018\u0002\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\f\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010$\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b-\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\r\u001a!\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0005H\u0007¢\u0006\u0002\u0010\u0006\u001aG\u0010\u0007\u001a\u00020\u00012\b\b\u0002\u0010\b\u001a\u00020\t2\u0006\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\u000b2\u0006\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00102\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u0012H\u0003¢\u0006\u0004\b\u0013\u0010\u0014\u001a\u008b\u0001\u0010\u0015\u001a\u00020\u00012\u0006\u0010\u0016\u001a\u00020\u00172\u0006\u0010\u0018\u001a\u00020\u000b2\b\u0010\u0019\u001a\u0004\u0018\u00010\u001a2\u0006\u0010\u001b\u001a\u00020\u001c2\f\u0010\u0011\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u0010\u001d\u001a\u00020\u001e2\u0006\u0010\u001f\u001a\u00020\u001e2\u0006\u0010 \u001a\u00020\u000b2\u0006\u0010!\u001a\u00020\u001c2\u0006\u0010\"\u001a\u00020\u001e2\u0006\u0010#\u001a\u00020\u001e2\b\u0010$\u001a\u0004\u0018\u00010%2\b\u0010&\u001a\u0004\u0018\u00010'2\b\b\u0002\u0010(\u001a\u00020\u001eH\u0003¢\u0006\u0002\u0010)\u001a\u007f\u0010*\u001a\u00020\u00012\u0006\u0010+\u001a\u00020,2\u0006\u0010-\u001a\u00020\u001c2\u0006\u0010.\u001a\u00020\u001c2\f\u0010/\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\f\u00100\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u0006\u00101\u001a\u00020\u001e2\u0006\u0010 \u001a\u00020\u000b2\u0006\u00102\u001a\u00020\u001e2\u0006\u0010!\u001a\u00020\u001c2\b\b\u0002\u00103\u001a\u00020\u001e2\b\b\u0002\u00104\u001a\u00020\u001e2\b\b\u0002\u00105\u001a\u00020\u001eH\u0003¢\u0006\u0002\u00106\u001a\u0018\u00107\u001a\u00020\u000b2\u0006\u00108\u001a\u00020\u001a2\u0006\u00109\u001a\u00020:H\u0002\u001a=\u0010;\u001a\u00020\u00012\u0006\u0010<\u001a\u00020\u000b2\u0006\u0010=\u001a\u00020\u000b2\b\b\u0002\u0010>\u001a\u00020\u001e2\b\b\u0002\u0010?\u001a\u00020\u00102\b\b\u0002\u0010@\u001a\u00020AH\u0003¢\u0006\u0004\bB\u0010C\u001aY\u0010D\u001a\u00020\u00012\u0006\u0010+\u001a\u00020,2\f\u0010E\u001a\b\u0012\u0004\u0012\u00020G0F2\f\u0010H\u001a\b\u0012\u0004\u0012\u00020\u00010\u00122\u001e\u0010/\u001a\u001a\u0012\n\u0012\b\u0012\u0004\u0012\u00020J0F\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010I2\u0006\u0010 \u001a\u00020\u000bH\u0003¢\u0006\u0002\u0010K\u001a\"\u0010N\u001a\u0014\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b0O2\u0006\u0010P\u001a\u00020\u000bH\u0002\u001ae\u0010Q\u001a\u00020\u00012\u0006\u0010=\u001a\u00020\u000b2\u0012\u0010R\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u00010S2\u0006\u0010T\u001a\u00020\u000b2\b\b\u0002\u0010\b\u001a\u00020\t2\b\b\u0002\u0010U\u001a\u00020V2\b\b\u0002\u0010W\u001a\u00020\u001e2\b\b\u0002\u0010@\u001a\u00020A2\b\b\u0002\u0010X\u001a\u00020YH\u0003¢\u0006\u0004\bZ\u0010[\u001a\u001d\u0010\\\u001a\u00020\u00012\u0006\u0010]\u001a\u00020\u000b2\u0006\u0010^\u001a\u00020\u000bH\u0003¢\u0006\u0002\u0010_\u001a3\u0010`\u001a\u00020\u00012\u0006\u0010<\u001a\u00020\u000b2\u0006\u0010=\u001a\u00020\u000b2\b\b\u0002\u0010>\u001a\u00020\u001e2\b\b\u0002\u0010@\u001a\u00020AH\u0003¢\u0006\u0004\ba\u0010b\"\u0014\u0010L\u001a\b\u0012\u0004\u0012\u00020M0FX\u0082\u0004¢\u0006\u0002\n\u0000¨\u0006c²\u0006\u0010\u0010d\u001a\b\u0012\u0004\u0012\u00020,0FX\u008a\u0084\u0002²\u0006\u0010\u0010e\u001a\b\u0012\u0004\u0012\u00020f0FX\u008a\u0084\u0002²\u0006\n\u0010g\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\n\u0010h\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\u0016\u0010i\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0jX\u008a\u0084\u0002²\u0006\u0016\u0010k\u001a\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0jX\u008a\u0084\u0002²\u0006\u0010\u0010l\u001a\b\u0012\u0004\u0012\u00020\u00170FX\u008a\u0084\u0002²\u0006\u0010\u0010m\u001a\b\u0012\u0004\u0012\u00020%0FX\u008a\u0084\u0002²\u0006\u0016\u0010n\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020\u000b0jX\u008a\u0084\u0002²\u0006\u0016\u0010o\u001a\u000e\u0012\u0004\u0012\u00020\u000b\u0012\u0004\u0012\u00020'0jX\u008a\u0084\u0002²\u0006\"\u0010p\u001a\u001a\u0012\u0004\u0012\u00020\u000b\u0012\u0010\u0012\u000e\u0012\u0004\u0012\u00020,\u0012\u0004\u0012\u00020\u001c0j0jX\u008a\u0084\u0002²\u0006\f\u0010q\u001a\u0004\u0018\u00010rX\u008a\u0084\u0002²\u0006\u0010\u0010s\u001a\b\u0012\u0004\u0012\u00020t0FX\u008a\u0084\u0002²\u0006\n\u0010u\u001a\u00020vX\u008a\u0084\u0002²\u0006\n\u0010w\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\f\u0010x\u001a\u0004\u0018\u00010\u0017X\u008a\u0084\u0002²\u0006\n\u0010y\u001a\u00020\u001eX\u008a\u0084\u0002²\u0006\f\u0010z\u001a\u0004\u0018\u00010\u000bX\u008a\u0084\u0002²\u0006\f\u0010{\u001a\u0004\u0018\u00010\u001eX\u008a\u0084\u0002²\u0006\f\u0010|\u001a\u0004\u0018\u00010\u001cX\u008a\u0084\u0002²\u0006\n\u00109\u001a\u00020:X\u008a\u0084\u0002²\u0006\u0010\u0010E\u001a\b\u0012\u0004\u0012\u00020G0FX\u008a\u0084\u0002²\u0006\n\u0010}\u001a\u00020\u001cX\u008a\u0084\u0002²\u0006\n\u0010~\u001a\u00020\u000bX\u008a\u0084\u0002²\u0006\f\u0010\u007f\u001a\u0004\u0018\u00010,X\u008a\u008e\u0002²\u0006\u000b\u0010\u0080\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0081\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0082\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0083\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0084\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0085\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0086\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0087\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0088\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0089\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008a\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008b\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008c\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008d\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008e\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u008f\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\r\u0010\u0090\u0001\u001a\u0004\u0018\u00010\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u0091\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0092\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0093\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0094\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0095\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0096\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0097\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0098\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u0099\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009a\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009b\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009c\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010\u009d\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u009e\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010\u009f\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010 \u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010¡\u0001\u001a\u00020\u001eX\u008a\u008e\u0002²\u0006\u000b\u0010¢\u0001\u001a\u00020\u0010X\u008a\u0084\u0002²\u0006\f\u0010£\u0001\u001a\u00030¤\u0001X\u008a\u0084\u0002²\u0006\u000b\u0010¥\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u0012\u0010¦\u0001\u001a\t\u0012\u0005\u0012\u00030§\u00010FX\u008a\u0084\u0002²\u0006\u000b\u0010¨\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010©\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010ª\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010«\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u0012\u0010¬\u0001\u001a\t\u0012\u0005\u0012\u00030§\u00010FX\u008a\u0084\u0002²\u0006\u000b\u0010\u00ad\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010®\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010¯\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010°\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u000b\u0010±\u0001\u001a\u00020\u000bX\u008a\u008e\u0002²\u0006\u000b\u0010²\u0001\u001a\u00020\u001cX\u008a\u008e\u0002²\u0006\u0011\u0010³\u0001\u001a\b\u0012\u0004\u0012\u00020J0FX\u008a\u008e\u0002²\u0006\u000b\u0010´\u0001\u001a\u00020\u000bX\u008a\u008e\u0002"}, d2 = {"BillingScreen", "", "billingViewModel", "Lcom/example/sasloopmanager/BillingViewModel;", "user", "Lcom/example/sasloopmanager/data/UserProfile;", "(Lcom/example/sasloopmanager/BillingViewModel;Lcom/example/sasloopmanager/data/UserProfile;Landroidx/compose/runtime/Composer;II)V", "FlowCard", "modifier", "Landroidx/compose/ui/Modifier;", "title", "", "subtext", "icon", "Landroidx/compose/ui/graphics/vector/ImageVector;", "iconColor", "Landroidx/compose/ui/graphics/Color;", "onClick", "Lkotlin/Function0;", "FlowCard-FHprtrg", "(Landroidx/compose/ui/Modifier;Ljava/lang/String;Ljava/lang/String;Landroidx/compose/ui/graphics/vector/ImageVector;JLkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;II)V", "TableCard", "table", "Lcom/example/sasloopmanager/data/TableItem;", NotificationCompat.CATEGORY_STATUS, "orderTotal", "", "orderItemsCount", "", "showBillDetails", "", "showOrderStatus", "currency", "decimalPlaces", "showKOTNoOnTable", "displayTimeOnTable", "activeOrder", "Lcom/example/sasloopmanager/data/Order;", "activeTimestamp", "", "isSelected", "(Lcom/example/sasloopmanager/data/TableItem;Ljava/lang/String;Ljava/lang/Double;ILkotlin/jvm/functions/Function0;ZZLjava/lang/String;IZZLcom/example/sasloopmanager/data/Order;Ljava/lang/Long;ZLandroidx/compose/runtime/Composer;III)V", "MenuItemCard", "item", "Lcom/example/sasloopmanager/data/MenuItem;", "qtyInCart", "punchedQty", "onAdd", "onRemove", "isCompact", "showItemCodeDetails", "showItemImage", "showItemsDetails", "showItemsPrepTime", "(Lcom/example/sasloopmanager/data/MenuItem;IILkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function0;ZLjava/lang/String;ZIZZZLandroidx/compose/runtime/Composer;III)V", "formatPrice", "price", "posSettings", "Lcom/example/sasloopmanager/data/PosSettings;", "ReceiptRow", "label", "value", "isBold", "color", "fontSize", "Landroidx/compose/ui/unit/TextUnit;", "ReceiptRow-6jM-SoI", "(Ljava/lang/String;Ljava/lang/String;ZJJLandroidx/compose/runtime/Composer;II)V", "ItemCustomizationDialog", "optionGroups", "", "Lcom/example/sasloopmanager/data/OptionGroup;", "onDismiss", "Lkotlin/Function2;", "Lcom/example/sasloopmanager/data/SelectedModifier;", "(Lcom/example/sasloopmanager/data/MenuItem;Ljava/util/List;Lkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function2;Ljava/lang/String;Landroidx/compose/runtime/Composer;I)V", "countryCodes", "Lcom/example/sasloopmanager/CountryCodeItem;", "parsePhoneNumber", "Lkotlin/Triple;", "fullPhone", "CompactTextField", "onValueChange", "Lkotlin/Function1;", "placeholder", "keyboardOptions", "Landroidx/compose/foundation/text/KeyboardOptions;", "singleLine", "shape", "Landroidx/compose/foundation/shape/CornerBasedShape;", "CompactTextField-03iij_k", "(Ljava/lang/String;Lkotlin/jvm/functions/Function1;Ljava/lang/String;Landroidx/compose/ui/Modifier;Landroidx/compose/foundation/text/KeyboardOptions;ZJLandroidx/compose/foundation/shape/CornerBasedShape;Landroidx/compose/runtime/Composer;II)V", "ThermalGridRow", "left", "right", "(Ljava/lang/String;Ljava/lang/String;Landroidx/compose/runtime/Composer;I)V", "ThermalReceiptRow", "ThermalReceiptRow-JHQioms", "(Ljava/lang/String;Ljava/lang/String;ZJLandroidx/compose/runtime/Composer;II)V", "app", "catalog", "categories", "Lcom/example/sasloopmanager/data/CategoryItem;", "selectedCategory", "searchQuery", "cart", "", "oldKotItems", "tables", "activeOrders", "tableStatuses", "tableActiveTimestamps", "tableCarts", "customerHistory", "Lcom/example/sasloopmanager/data/CustomerHistoryResponse;", "staffList", "Lcom/example/sasloopmanager/data/StaffUser;", "flowState", "Lcom/example/sasloopmanager/BillingFlowState;", "activeFlow", "selectedTable", "isLoading", "error", "orderSuccess", "editingOrderId", "selectedPriceTier", "currentOrderType", "selectedItemForModifiers", "activeSubTab", "foodTypeFilter", "selectedDepartment", "customerName", "customerPhone", "customerAddress", "orderType", "paymentMethod", "discountInput", "serviceChargeInput", "deliveryChargeInput", "preOrderIdInput", "advancePaidInput", "kotNote", "coversCount", "ebillEnabled", "selectedWaiter", "isComplimentaryOrder", "showDiscountDialog", "showChargesDialog", "showWaiterDialog", "showHistoryDialog", "showPreviewDialog", "showCustomerDialog", "showNoteDialog", "showPaymentDialog", "showOldKotDialog", "showSplitBillDialog", "showCategoryMenu", "selectedDialCode", "selectedCountryFlag", "selectedCountryCode", "showCountryDropdown", "hasAutoRedirected", "trackColor", "thumbOffset", "Landroidx/compose/ui/unit/Dp;", "qtyText", "searchResults", "Lcom/example/sasloopmanager/data/SearchedCustomer;", "discountVal", "phoneVal", "nameVal", "addressVal", "dialogSearchResults", "noteVal", "historyTab", "splitTab", "portions", "percentInput", "ticks", "selectedModifiers", "kitchenNote"}, k = 2, mv = {2, 3, 0}, xi = AndroidUiModes.UI_MODE_NIGHT_MASK)
/* loaded from: classes3.dex */
public final class BillingScreenKt {
    private static final List<CountryCodeItem> countryCodes = CollectionsKt.listOf((Object[]) new CountryCodeItem[]{new CountryCodeItem("IN", "+91", "🇮🇳", "India"), new CountryCodeItem("US", "+1", "🇺🇸", "United States"), new CountryCodeItem("GB", "+44", "🇬🇧", "United Kingdom"), new CountryCodeItem("AE", "+971", "🇦🇪", "United Arab Emirates"), new CountryCodeItem("SA", "+966", "🇸🇦", "Saudi Arabia"), new CountryCodeItem("QA", "+974", "🇶🇦", "Qatar"), new CountryCodeItem("OM", "+968", "🇴🇲", "Oman"), new CountryCodeItem("BH", "+973", "🇧🇭", "Bahrain"), new CountryCodeItem("KW", "+965", "🇰🇼", "Kuwait"), new CountryCodeItem("CA", "+1", "🇨🇦", "Canada"), new CountryCodeItem("AU", "+61", "🇦🇺", "Australia"), new CountryCodeItem("SG", "+65", "🇸🇬", "Singapore"), new CountryCodeItem("MY", "+60", "🇲🇾", "Malaysia"), new CountryCodeItem("PK", "+92", "🇵🇰", "Pakistan"), new CountryCodeItem("BD", "+880", "🇧🇩", "Bangladesh"), new CountryCodeItem("LK", "+94", "🇱🇰", "Sri Lanka"), new CountryCodeItem("NP", "+977", "🇳🇵", "Nepal"), new CountryCodeItem("DE", "+49", "🇩🇪", "Germany"), new CountryCodeItem("FR", "+33", "🇫🇷", "France"), new CountryCodeItem("IT", "+39", "🇮🇹", "Italy"), new CountryCodeItem("ES", "+34", "🇪🇸", "Spain"), new CountryCodeItem("NL", "+31", "🇳🇱", "Netherlands"), new CountryCodeItem("CH", "+41", "🇨🇭", "Switzerland"), new CountryCodeItem("SE", "+46", "🇸🇪", "Sweden"), new CountryCodeItem("NO", "+47", "🇳🇴", "Norway"), new CountryCodeItem("NZ", "+64", "🇳🇿", "New Zealand"), new CountryCodeItem("ZA", "+27", "🇿🇦", "South Africa"), new CountryCodeItem("JP", "+81", "🇯🇵", "Japan"), new CountryCodeItem("CN", "+86", "🇨🇳", "China")});

    /* compiled from: BillingScreen.kt */
    @Metadata(k = 3, mv = {2, 3, 0}, xi = AndroidUiModes.UI_MODE_NIGHT_MASK)
    /* loaded from: classes3.dex */
    public static final /* synthetic */ class WhenMappings {
        public static final /* synthetic */ int[] $EnumSwitchMapping$0;

        static {
            int[] iArr = new int[BillingFlowState.values().length];
            try {
                iArr[BillingFlowState.SELECT_FLOW.ordinal()] = 1;
            } catch (NoSuchFieldError e) {
            }
            try {
                iArr[BillingFlowState.SELECT_TABLE.ordinal()] = 2;
            } catch (NoSuchFieldError e2) {
            }
            try {
                iArr[BillingFlowState.ORDERING.ordinal()] = 3;
            } catch (NoSuchFieldError e3) {
            }
            $EnumSwitchMapping$0 = iArr;
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit BillingScreen$lambda$141(BillingViewModel billingViewModel, UserProfile userProfile, int i, int i2, Composer composer, int i3) {
        BillingScreen(billingViewModel, userProfile, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit CompactTextField_03iij_k$lambda$1(String str, Function1 function1, String str2, Modifier modifier, KeyboardOptions keyboardOptions, boolean z, long j, CornerBasedShape cornerBasedShape, int i, int i2, Composer composer, int i3) {
        m8474CompactTextField03iij_k(str, function1, str2, modifier, keyboardOptions, z, j, cornerBasedShape, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit FlowCard_FHprtrg$lambda$1(Modifier modifier, String str, String str2, ImageVector imageVector, long j, Function0 function0, int i, int i2, Composer composer, int i3) {
        m8475FlowCardFHprtrg(modifier, str, str2, imageVector, j, function0, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ItemCustomizationDialog$lambda$8(MenuItem menuItem, List list, Function0 function0, Function2 function2, String str, int i, Composer composer, int i2) {
        ItemCustomizationDialog(menuItem, list, function0, function2, str, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit MenuItemCard$lambda$2(MenuItem menuItem, int i, int i2, Function0 function0, Function0 function02, boolean z, String str, boolean z2, int i3, boolean z3, boolean z4, boolean z5, int i4, int i5, int i6, Composer composer, int i7) {
        MenuItemCard(menuItem, i, i2, function0, function02, z, str, z2, i3, z3, z4, z5, composer, RecomposeScopeImplKt.updateChangedFlags(i4 | 1), RecomposeScopeImplKt.updateChangedFlags(i5), i6);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ReceiptRow_6jM_SoI$lambda$1(String str, String str2, boolean z, long j, long j2, int i, int i2, Composer composer, int i3) {
        m8476ReceiptRow6jMSoI(str, str2, z, j, j2, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit TableCard$lambda$5(TableItem tableItem, String str, Double d, int i, Function0 function0, boolean z, boolean z2, String str2, int i2, boolean z3, boolean z4, Order order, Long l, boolean z5, int i3, int i4, int i5, Composer composer, int i6) {
        TableCard(tableItem, str, d, i, function0, z, z2, str2, i2, z3, z4, order, l, z5, composer, RecomposeScopeImplKt.updateChangedFlags(i3 | 1), RecomposeScopeImplKt.updateChangedFlags(i4), i5);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ThermalGridRow$lambda$1(String str, String str2, int i, Composer composer, int i2) {
        ThermalGridRow(str, str2, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ThermalReceiptRow_JHQioms$lambda$1(String str, String str2, boolean z, long j, int i, int i2, Composer composer, int i3) {
        m8477ThermalReceiptRowJHQioms(str, str2, z, j, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    /* JADX WARN: Code restructure failed: missing block: B:1053:0x6be3, code lost:
    
        if (r8 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1217;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1085:0x6ee1, code lost:
    
        if (r5 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1241;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1122:0x77c1, code lost:
    
        if (r12 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1296;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1181:0x832b, code lost:
    
        if (r10 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1372;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1194:0x8487, code lost:
    
        if (r12 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1392;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1205:0x867d, code lost:
    
        if (r10 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1407;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1226:0x896e, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1436;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1439:0x9e01, code lost:
    
        if (r0 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1606;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1447:0x9e8c, code lost:
    
        if (r0 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1618;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1461:0xa049, code lost:
    
        if (r0 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1637;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1469:0xa0d4, code lost:
    
        if (r0 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1649;
     */
    /* JADX WARN: Code restructure failed: missing block: B:1493:0x1e04, code lost:
    
        if (r4 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L604;
     */
    /* JADX WARN: Code restructure failed: missing block: B:199:0x107f, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L379;
     */
    /* JADX WARN: Code restructure failed: missing block: B:242:0x12ca, code lost:
    
        if (kotlin.text.StringsKt.contains(r6, BillingScreen$lambda$3(r126), r8) == r8) goto L441;
     */
    /* JADX WARN: Code restructure failed: missing block: B:313:0x191c, code lost:
    
        if (r10 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L518;
     */
    /* JADX WARN: Code restructure failed: missing block: B:354:0x1d8f, code lost:
    
        if (r4 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L591;
     */
    /* JADX WARN: Code restructure failed: missing block: B:435:0xa706, code lost:
    
        if (r10 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1732;
     */
    /* JADX WARN: Code restructure failed: missing block: B:578:0x3043, code lost:
    
        if (r9 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L734;
     */
    /* JADX WARN: Code restructure failed: missing block: B:592:0x3278, code lost:
    
        if (r13 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L754;
     */
    /* JADX WARN: Code restructure failed: missing block: B:798:0x4e7a, code lost:
    
        if (r8 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L942;
     */
    /* JADX WARN: Code restructure failed: missing block: B:829:0x5240, code lost:
    
        if (r5 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L984;
     */
    /* JADX WARN: Code restructure failed: missing block: B:840:0x546c, code lost:
    
        if (r14 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L999;
     */
    /* JADX WARN: Code restructure failed: missing block: B:997:0x5f3c, code lost:
    
        if (r0 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L1115;
     */
    /* JADX WARN: Multi-variable search skipped. Vars limit reached: 9103 (expected less than 5000) */
    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Removed duplicated region for block: B:1025:0x5a07  */
    /* JADX WARN: Removed duplicated region for block: B:1027:0x5962  */
    /* JADX WARN: Removed duplicated region for block: B:1028:0x5471  */
    /* JADX WARN: Removed duplicated region for block: B:1029:0x5306  */
    /* JADX WARN: Removed duplicated region for block: B:1030:0x5244  */
    /* JADX WARN: Removed duplicated region for block: B:1031:0x518a  */
    /* JADX WARN: Removed duplicated region for block: B:1032:0x5151  */
    /* JADX WARN: Removed duplicated region for block: B:104:0x086c  */
    /* JADX WARN: Removed duplicated region for block: B:109:0x08e5  */
    /* JADX WARN: Removed duplicated region for block: B:1121:0x77b9  */
    /* JADX WARN: Removed duplicated region for block: B:1126:0x783f  */
    /* JADX WARN: Removed duplicated region for block: B:1129:0x7976  */
    /* JADX WARN: Removed duplicated region for block: B:1132:0x7982  */
    /* JADX WARN: Removed duplicated region for block: B:1135:0x7a78  */
    /* JADX WARN: Removed duplicated region for block: B:1138:0x7a84  */
    /* JADX WARN: Removed duplicated region for block: B:1141:0x7b64  */
    /* JADX WARN: Removed duplicated region for block: B:1144:0x7c29  */
    /* JADX WARN: Removed duplicated region for block: B:1147:0x7c35  */
    /* JADX WARN: Removed duplicated region for block: B:114:0x0940  */
    /* JADX WARN: Removed duplicated region for block: B:1150:0x7d5a  */
    /* JADX WARN: Removed duplicated region for block: B:1153:0x7d66  */
    /* JADX WARN: Removed duplicated region for block: B:1156:0x7f02  */
    /* JADX WARN: Removed duplicated region for block: B:1159:0x8051  */
    /* JADX WARN: Removed duplicated region for block: B:1162:0x805d  */
    /* JADX WARN: Removed duplicated region for block: B:1170:0x81bc  */
    /* JADX WARN: Removed duplicated region for block: B:1175:0x823a  */
    /* JADX WARN: Removed duplicated region for block: B:1180:0x8323  */
    /* JADX WARN: Removed duplicated region for block: B:1185:0x8393  */
    /* JADX WARN: Removed duplicated region for block: B:1190:0x840d  */
    /* JADX WARN: Removed duplicated region for block: B:1193:0x847f  */
    /* JADX WARN: Removed duplicated region for block: B:1198:0x85d2  */
    /* JADX WARN: Removed duplicated region for block: B:119:0x099b  */
    /* JADX WARN: Removed duplicated region for block: B:1201:0x85de  */
    /* JADX WARN: Removed duplicated region for block: B:1204:0x8675  */
    /* JADX WARN: Removed duplicated region for block: B:1209:0x871f  */
    /* JADX WARN: Removed duplicated region for block: B:1214:0x87f1  */
    /* JADX WARN: Removed duplicated region for block: B:1217:0x87fd  */
    /* JADX WARN: Removed duplicated region for block: B:1220:0x88dc  */
    /* JADX WARN: Removed duplicated region for block: B:1225:0x8966  */
    /* JADX WARN: Removed duplicated region for block: B:1230:0x89dd  */
    /* JADX WARN: Removed duplicated region for block: B:1236:0x8a7c A[LOOP:7: B:1234:0x8a76->B:1236:0x8a7c, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:1240:0x8aab  */
    /* JADX WARN: Removed duplicated region for block: B:1243:0x8b66  */
    /* JADX WARN: Removed duplicated region for block: B:1246:0x8b72  */
    /* JADX WARN: Removed duplicated region for block: B:1249:0x8c7d  */
    /* JADX WARN: Removed duplicated region for block: B:124:0x09f8  */
    /* JADX WARN: Removed duplicated region for block: B:1252:0x8c89  */
    /* JADX WARN: Removed duplicated region for block: B:1255:0x8ed0  */
    /* JADX WARN: Removed duplicated region for block: B:1258:0x8edc  */
    /* JADX WARN: Removed duplicated region for block: B:1261:0x8f55  */
    /* JADX WARN: Removed duplicated region for block: B:1269:0x919f  */
    /* JADX WARN: Removed duplicated region for block: B:1274:0x91bf  */
    /* JADX WARN: Removed duplicated region for block: B:1277:0x90d4  */
    /* JADX WARN: Removed duplicated region for block: B:1278:0x8ee2  */
    /* JADX WARN: Removed duplicated region for block: B:1279:0x8c8f  */
    /* JADX WARN: Removed duplicated region for block: B:1280:0x8b78  */
    /* JADX WARN: Removed duplicated region for block: B:1281:0x8aae  */
    /* JADX WARN: Removed duplicated region for block: B:1283:0x89f3  */
    /* JADX WARN: Removed duplicated region for block: B:1284:0x8972  */
    /* JADX WARN: Removed duplicated region for block: B:1286:0x8803  */
    /* JADX WARN: Removed duplicated region for block: B:1288:0x8681  */
    /* JADX WARN: Removed duplicated region for block: B:1289:0x85e4  */
    /* JADX WARN: Removed duplicated region for block: B:1290:0x848b  */
    /* JADX WARN: Removed duplicated region for block: B:1291:0x841f  */
    /* JADX WARN: Removed duplicated region for block: B:1293:0x83a3 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1294:0x832f  */
    /* JADX WARN: Removed duplicated region for block: B:1299:0x8063  */
    /* JADX WARN: Removed duplicated region for block: B:129:0x0a50  */
    /* JADX WARN: Removed duplicated region for block: B:1300:0x7f11  */
    /* JADX WARN: Removed duplicated region for block: B:1301:0x7d6c  */
    /* JADX WARN: Removed duplicated region for block: B:1302:0x7c3b  */
    /* JADX WARN: Removed duplicated region for block: B:1303:0x7b76  */
    /* JADX WARN: Removed duplicated region for block: B:1304:0x7a8a  */
    /* JADX WARN: Removed duplicated region for block: B:1305:0x7988  */
    /* JADX WARN: Removed duplicated region for block: B:1306:0x7852  */
    /* JADX WARN: Removed duplicated region for block: B:1307:0x77c5  */
    /* JADX WARN: Removed duplicated region for block: B:1336:0x929f  */
    /* JADX WARN: Removed duplicated region for block: B:134:0x0a96  */
    /* JADX WARN: Removed duplicated region for block: B:1377:0x98b7  */
    /* JADX WARN: Removed duplicated region for block: B:137:0x0ad1  */
    /* JADX WARN: Removed duplicated region for block: B:1382:0x98d4  */
    /* JADX WARN: Removed duplicated region for block: B:140:0x0b0c  */
    /* JADX WARN: Removed duplicated region for block: B:1416:0x9945  */
    /* JADX WARN: Removed duplicated region for block: B:143:0x0b47  */
    /* JADX WARN: Removed duplicated region for block: B:146:0x0b82  */
    /* JADX WARN: Removed duplicated region for block: B:1486:0x1dc8  */
    /* JADX WARN: Removed duplicated region for block: B:1498:0x1ce8  */
    /* JADX WARN: Removed duplicated region for block: B:149:0x0bbd  */
    /* JADX WARN: Removed duplicated region for block: B:1500:0x1b9d  */
    /* JADX WARN: Removed duplicated region for block: B:1520:0x1b31  */
    /* JADX WARN: Removed duplicated region for block: B:1521:0x1b38  */
    /* JADX WARN: Removed duplicated region for block: B:1522:0x1a30  */
    /* JADX WARN: Removed duplicated region for block: B:1524:0x1988  */
    /* JADX WARN: Removed duplicated region for block: B:1525:0x1875  */
    /* JADX WARN: Removed duplicated region for block: B:1526:0x175f  */
    /* JADX WARN: Removed duplicated region for block: B:1527:0x161d  */
    /* JADX WARN: Removed duplicated region for block: B:1528:0x150d  */
    /* JADX WARN: Removed duplicated region for block: B:152:0x0bf8  */
    /* JADX WARN: Removed duplicated region for block: B:1530:0x1447  */
    /* JADX WARN: Removed duplicated region for block: B:1533:0x1346  */
    /* JADX WARN: Removed duplicated region for block: B:1535:0x135a  */
    /* JADX WARN: Removed duplicated region for block: B:1540:0x1140  */
    /* JADX WARN: Removed duplicated region for block: B:1541:0x1083  */
    /* JADX WARN: Removed duplicated region for block: B:1543:0x0fe6  */
    /* JADX WARN: Removed duplicated region for block: B:1544:0x0f48  */
    /* JADX WARN: Removed duplicated region for block: B:1547:0x0ea4  */
    /* JADX WARN: Removed duplicated region for block: B:155:0x0c33  */
    /* JADX WARN: Removed duplicated region for block: B:1560:0x0f05  */
    /* JADX WARN: Removed duplicated region for block: B:1561:0x0e91 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1562:0x0e4d  */
    /* JADX WARN: Removed duplicated region for block: B:1564:0x0e00 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1566:0x0da3 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1568:0x0d46  */
    /* JADX WARN: Removed duplicated region for block: B:1569:0x0cfb  */
    /* JADX WARN: Removed duplicated region for block: B:1570:0x0cc0  */
    /* JADX WARN: Removed duplicated region for block: B:1571:0x0c85  */
    /* JADX WARN: Removed duplicated region for block: B:1572:0x0c4a  */
    /* JADX WARN: Removed duplicated region for block: B:1573:0x0c0f  */
    /* JADX WARN: Removed duplicated region for block: B:1574:0x0bd4  */
    /* JADX WARN: Removed duplicated region for block: B:1575:0x0b99  */
    /* JADX WARN: Removed duplicated region for block: B:1576:0x0b5e  */
    /* JADX WARN: Removed duplicated region for block: B:1577:0x0b23  */
    /* JADX WARN: Removed duplicated region for block: B:1578:0x0ae8  */
    /* JADX WARN: Removed duplicated region for block: B:1579:0x0aad  */
    /* JADX WARN: Removed duplicated region for block: B:1581:0x0a5e A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1583:0x0a06 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1585:0x09a9 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1587:0x094e A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1589:0x08f3 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:158:0x0c6e  */
    /* JADX WARN: Removed duplicated region for block: B:1591:0x087a A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1594:0x07a4 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1596:0x0748 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1598:0x06ec A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1600:0x0690 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1603:0x062c  */
    /* JADX WARN: Removed duplicated region for block: B:1605:0x062f  */
    /* JADX WARN: Removed duplicated region for block: B:1609:0x0619 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1611:0x05bf A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1613:0x0562 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:1616:0x04be  */
    /* JADX WARN: Removed duplicated region for block: B:161:0x0ca9  */
    /* JADX WARN: Removed duplicated region for block: B:1633:0x0508  */
    /* JADX WARN: Removed duplicated region for block: B:164:0x0ce4  */
    /* JADX WARN: Removed duplicated region for block: B:167:0x0d36  */
    /* JADX WARN: Removed duplicated region for block: B:172:0x0d93  */
    /* JADX WARN: Removed duplicated region for block: B:177:0x0df0  */
    /* JADX WARN: Removed duplicated region for block: B:182:0x0e36  */
    /* JADX WARN: Removed duplicated region for block: B:185:0x0e82  */
    /* JADX WARN: Removed duplicated region for block: B:190:0x0f31  */
    /* JADX WARN: Removed duplicated region for block: B:193:0x0f88  */
    /* JADX WARN: Removed duplicated region for block: B:198:0x1077  */
    /* JADX WARN: Removed duplicated region for block: B:203:0x1121  */
    /* JADX WARN: Removed duplicated region for block: B:209:0x11a5  */
    /* JADX WARN: Removed duplicated region for block: B:222:0x1219  */
    /* JADX WARN: Removed duplicated region for block: B:229:0x126d  */
    /* JADX WARN: Removed duplicated region for block: B:233:0x1299  */
    /* JADX WARN: Removed duplicated region for block: B:246:0x12dc A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:250:0x12e7  */
    /* JADX WARN: Removed duplicated region for block: B:253:0x12ea A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:258:0x12d5  */
    /* JADX WARN: Removed duplicated region for block: B:260:0x1274  */
    /* JADX WARN: Removed duplicated region for block: B:265:0x1258  */
    /* JADX WARN: Removed duplicated region for block: B:273:0x1329  */
    /* JADX WARN: Removed duplicated region for block: B:278:0x1392  */
    /* JADX WARN: Removed duplicated region for block: B:286:0x14fd  */
    /* JADX WARN: Removed duplicated region for block: B:289:0x1509  */
    /* JADX WARN: Removed duplicated region for block: B:292:0x160b  */
    /* JADX WARN: Removed duplicated region for block: B:295:0x1617  */
    /* JADX WARN: Removed duplicated region for block: B:298:0x174d  */
    /* JADX WARN: Removed duplicated region for block: B:301:0x1759  */
    /* JADX WARN: Removed duplicated region for block: B:304:0x1863  */
    /* JADX WARN: Removed duplicated region for block: B:307:0x186f  */
    /* JADX WARN: Removed duplicated region for block: B:310:0x18f2  */
    /* JADX WARN: Removed duplicated region for block: B:318:0x1a1e  */
    /* JADX WARN: Removed duplicated region for block: B:321:0x1a2a  */
    /* JADX WARN: Removed duplicated region for block: B:324:0x1ab6  */
    /* JADX WARN: Removed duplicated region for block: B:326:0x1abc  */
    /* JADX WARN: Removed duplicated region for block: B:332:0x1b86  */
    /* JADX WARN: Removed duplicated region for block: B:336:0x1b98  */
    /* JADX WARN: Removed duplicated region for block: B:338:0x1ba0  */
    /* JADX WARN: Removed duplicated region for block: B:345:0x1cd6  */
    /* JADX WARN: Removed duplicated region for block: B:348:0x1ce2  */
    /* JADX WARN: Removed duplicated region for block: B:351:0x1d65  */
    /* JADX WARN: Removed duplicated region for block: B:359:0x1e95  */
    /* JADX WARN: Removed duplicated region for block: B:361:0x1ea4  */
    /* JADX WARN: Removed duplicated region for block: B:379:0xa159  */
    /* JADX WARN: Removed duplicated region for block: B:385:0xa1f0  */
    /* JADX WARN: Removed duplicated region for block: B:391:0xa283  */
    /* JADX WARN: Removed duplicated region for block: B:397:0xa30c  */
    /* JADX WARN: Removed duplicated region for block: B:405:0xa3ca  */
    /* JADX WARN: Removed duplicated region for block: B:411:0xa44b  */
    /* JADX WARN: Removed duplicated region for block: B:417:0xa529  */
    /* JADX WARN: Removed duplicated region for block: B:423:0xa5bb  */
    /* JADX WARN: Removed duplicated region for block: B:429:0xa694  */
    /* JADX WARN: Removed duplicated region for block: B:440:0xa75f  */
    /* JADX WARN: Removed duplicated region for block: B:446:0xa7eb  */
    /* JADX WARN: Removed duplicated region for block: B:477:0xa991  */
    /* JADX WARN: Removed duplicated region for block: B:486:0xa942  */
    /* JADX WARN: Removed duplicated region for block: B:488:0xa7d7  */
    /* JADX WARN: Removed duplicated region for block: B:491:0xa73e  */
    /* JADX WARN: Removed duplicated region for block: B:493:0xa671  */
    /* JADX WARN: Removed duplicated region for block: B:495:0xa5a9  */
    /* JADX WARN: Removed duplicated region for block: B:497:0xa501  */
    /* JADX WARN: Removed duplicated region for block: B:499:0xa439  */
    /* JADX WARN: Removed duplicated region for block: B:501:0xa3a6  */
    /* JADX WARN: Removed duplicated region for block: B:503:0xa2f6  */
    /* JADX WARN: Removed duplicated region for block: B:505:0xa26e  */
    /* JADX WARN: Removed duplicated region for block: B:507:0xa1d5  */
    /* JADX WARN: Removed duplicated region for block: B:577:0x303b  */
    /* JADX WARN: Removed duplicated region for block: B:582:0x30c1  */
    /* JADX WARN: Removed duplicated region for block: B:585:0x3146  */
    /* JADX WARN: Removed duplicated region for block: B:588:0x31df  */
    /* JADX WARN: Removed duplicated region for block: B:591:0x3270  */
    /* JADX WARN: Removed duplicated region for block: B:596:0x332e  */
    /* JADX WARN: Removed duplicated region for block: B:599:0x333a  */
    /* JADX WARN: Removed duplicated region for block: B:608:0x34dd A[LOOP:2: B:606:0x34d7->B:608:0x34dd, LOOP_END] */
    /* JADX WARN: Removed duplicated region for block: B:612:0x350d  */
    /* JADX WARN: Removed duplicated region for block: B:615:0x352f  */
    /* JADX WARN: Removed duplicated region for block: B:618:0x3552  */
    /* JADX WARN: Removed duplicated region for block: B:623:0x357b  */
    /* JADX WARN: Removed duplicated region for block: B:626:0x3590  */
    /* JADX WARN: Removed duplicated region for block: B:631:0x35a5  */
    /* JADX WARN: Removed duplicated region for block: B:634:0x35cd  */
    /* JADX WARN: Removed duplicated region for block: B:637:0x35dc  */
    /* JADX WARN: Removed duplicated region for block: B:640:0x35ef  */
    /* JADX WARN: Removed duplicated region for block: B:643:0x36c1  */
    /* JADX WARN: Removed duplicated region for block: B:646:0x36cd  */
    /* JADX WARN: Removed duplicated region for block: B:649:0x37e1  */
    /* JADX WARN: Removed duplicated region for block: B:64:0x0552  */
    /* JADX WARN: Removed duplicated region for block: B:652:0x37ed  */
    /* JADX WARN: Removed duplicated region for block: B:655:0x3a25  */
    /* JADX WARN: Removed duplicated region for block: B:658:0x3a31  */
    /* JADX WARN: Removed duplicated region for block: B:661:0x3ad0  */
    /* JADX WARN: Removed duplicated region for block: B:664:0x3bef  */
    /* JADX WARN: Removed duplicated region for block: B:667:0x3c03  */
    /* JADX WARN: Removed duplicated region for block: B:672:0x3e66  */
    /* JADX WARN: Removed duplicated region for block: B:675:0x3ef2  */
    /* JADX WARN: Removed duplicated region for block: B:678:0x4053  */
    /* JADX WARN: Removed duplicated region for block: B:681:0x405f  */
    /* JADX WARN: Removed duplicated region for block: B:684:0x4170  */
    /* JADX WARN: Removed duplicated region for block: B:687:0x417c  */
    /* JADX WARN: Removed duplicated region for block: B:690:0x41fd  */
    /* JADX WARN: Removed duplicated region for block: B:69:0x05af  */
    /* JADX WARN: Removed duplicated region for block: B:701:0x45db  */
    /* JADX WARN: Removed duplicated region for block: B:704:0x45f5  */
    /* JADX WARN: Removed duplicated region for block: B:709:0x477b  */
    /* JADX WARN: Removed duplicated region for block: B:712:0x48cf  */
    /* JADX WARN: Removed duplicated region for block: B:715:0x48e9  */
    /* JADX WARN: Removed duplicated region for block: B:720:0x4922  */
    /* JADX WARN: Removed duplicated region for block: B:721:0x48d2  */
    /* JADX WARN: Removed duplicated region for block: B:722:0x478d  */
    /* JADX WARN: Removed duplicated region for block: B:724:0x45de  */
    /* JADX WARN: Removed duplicated region for block: B:728:0x447b  */
    /* JADX WARN: Removed duplicated region for block: B:729:0x4182  */
    /* JADX WARN: Removed duplicated region for block: B:730:0x4065  */
    /* JADX WARN: Removed duplicated region for block: B:731:0x3f04  */
    /* JADX WARN: Removed duplicated region for block: B:732:0x3e76  */
    /* JADX WARN: Removed duplicated region for block: B:734:0x3ce2 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:735:0x3bf2  */
    /* JADX WARN: Removed duplicated region for block: B:736:0x3ae4  */
    /* JADX WARN: Removed duplicated region for block: B:737:0x3a37  */
    /* JADX WARN: Removed duplicated region for block: B:738:0x37f3  */
    /* JADX WARN: Removed duplicated region for block: B:739:0x36d3  */
    /* JADX WARN: Removed duplicated region for block: B:740:0x35f4  */
    /* JADX WARN: Removed duplicated region for block: B:741:0x35e1  */
    /* JADX WARN: Removed duplicated region for block: B:742:0x35d0  */
    /* JADX WARN: Removed duplicated region for block: B:743:0x35b4  */
    /* JADX WARN: Removed duplicated region for block: B:745:0x3580  */
    /* JADX WARN: Removed duplicated region for block: B:747:0x3538  */
    /* JADX WARN: Removed duplicated region for block: B:748:0x3512  */
    /* JADX WARN: Removed duplicated region for block: B:74:0x060b  */
    /* JADX WARN: Removed duplicated region for block: B:751:0x3340  */
    /* JADX WARN: Removed duplicated region for block: B:752:0x327c  */
    /* JADX WARN: Removed duplicated region for block: B:753:0x31f1  */
    /* JADX WARN: Removed duplicated region for block: B:754:0x3158  */
    /* JADX WARN: Removed duplicated region for block: B:755:0x30d4  */
    /* JADX WARN: Removed duplicated region for block: B:756:0x3047  */
    /* JADX WARN: Removed duplicated region for block: B:79:0x0682  */
    /* JADX WARN: Removed duplicated region for block: B:819:0x514c  */
    /* JADX WARN: Removed duplicated region for block: B:822:0x5180  */
    /* JADX WARN: Removed duplicated region for block: B:825:0x5207  */
    /* JADX WARN: Removed duplicated region for block: B:828:0x5237  */
    /* JADX WARN: Removed duplicated region for block: B:833:0x52f4  */
    /* JADX WARN: Removed duplicated region for block: B:836:0x5300  */
    /* JADX WARN: Removed duplicated region for block: B:839:0x5464  */
    /* JADX WARN: Removed duplicated region for block: B:84:0x06de  */
    /* JADX WARN: Removed duplicated region for block: B:850:0x5498  */
    /* JADX WARN: Removed duplicated region for block: B:863:0x54ca A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:865:? A[LOOP:3: B:848:0x5492->B:865:?, LOOP_END, SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:869:0x54cd A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:873:0x54e5  */
    /* JADX WARN: Removed duplicated region for block: B:89:0x073a  */
    /* JADX WARN: Removed duplicated region for block: B:918:0x59f5  */
    /* JADX WARN: Removed duplicated region for block: B:921:0x5a01  */
    /* JADX WARN: Removed duplicated region for block: B:924:0x5a7c  */
    /* JADX WARN: Removed duplicated region for block: B:933:0x63b5  */
    /* JADX WARN: Removed duplicated region for block: B:936:0x63c1  */
    /* JADX WARN: Removed duplicated region for block: B:939:0x64d4  */
    /* JADX WARN: Removed duplicated region for block: B:942:0x64e0  */
    /* JADX WARN: Removed duplicated region for block: B:945:0x656c  */
    /* JADX WARN: Removed duplicated region for block: B:94:0x0796  */
    /* JADX WARN: Removed duplicated region for block: B:951:0x669c  */
    /* JADX WARN: Removed duplicated region for block: B:954:0x671f  */
    /* JADX WARN: Removed duplicated region for block: B:957:0x6826  */
    /* JADX WARN: Removed duplicated region for block: B:969:0x6960  */
    /* JADX WARN: Removed duplicated region for block: B:970:0x672d  */
    /* JADX WARN: Removed duplicated region for block: B:971:0x66aa  */
    /* JADX WARN: Removed duplicated region for block: B:973:0x664b  */
    /* JADX WARN: Removed duplicated region for block: B:974:0x64e6  */
    /* JADX WARN: Removed duplicated region for block: B:975:0x63c7  */
    /* JADX WARN: Removed duplicated region for block: B:977:0x5c09  */
    /* JADX WARN: Removed duplicated region for block: B:99:0x07f4  */
    /* JADX WARN: Type inference failed for: r155v0, types: [int] */
    /* JADX WARN: Type inference failed for: r15v10 */
    /* JADX WARN: Type inference failed for: r15v11 */
    /* JADX WARN: Type inference failed for: r15v134 */
    /* JADX WARN: Type inference failed for: r15v256 */
    /* JADX WARN: Type inference failed for: r15v69 */
    /* JADX WARN: Type inference failed for: r15v70 */
    /* JADX WARN: Type inference failed for: r15v71 */
    /* JADX WARN: Type inference failed for: r15v72, types: [int] */
    /* JADX WARN: Type inference failed for: r261v1 */
    /* JADX WARN: Type inference failed for: r327v2 */
    /* JADX WARN: Type inference failed for: r327v3, types: [boolean] */
    /* JADX WARN: Type inference failed for: r327v4 */
    /* JADX WARN: Type inference failed for: r53v10 */
    /* JADX WARN: Type inference failed for: r53v11 */
    /* JADX WARN: Type inference failed for: r53v12 */
    /* JADX WARN: Type inference failed for: r53v13, types: [int] */
    /* JADX WARN: Type inference failed for: r53v32 */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final void BillingScreen(final com.example.sasloopmanager.BillingViewModel r398, com.example.sasloopmanager.data.UserProfile r399, androidx.compose.runtime.Composer r400, final int r401, final int r402) {
        /*
            Method dump skipped, instructions count: 43516
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, com.example.sasloopmanager.data.UserProfile, androidx.compose.runtime.Composer, int, int):void");
    }

    private static final List<MenuItem> BillingScreen$lambda$0(State<? extends List<MenuItem>> state) {
        return (List) state.getValue();
    }

    private static final List<CategoryItem> BillingScreen$lambda$1(State<? extends List<CategoryItem>> state) {
        return (List) state.getValue();
    }

    private static final String BillingScreen$lambda$2(State<String> state) {
        return (String) state.getValue();
    }

    private static final String BillingScreen$lambda$3(State<String> state) {
        return (String) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<MenuItem, Integer> BillingScreen$lambda$4(State<? extends Map<MenuItem, Integer>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<MenuItem, Integer> BillingScreen$lambda$5(State<? extends Map<MenuItem, Integer>> state) {
        return (Map) state.getValue();
    }

    private static final List<TableItem> BillingScreen$lambda$6(State<? extends List<TableItem>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final List<Order> BillingScreen$lambda$7(State<? extends List<Order>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, String> BillingScreen$lambda$8(State<? extends Map<String, String>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, Long> BillingScreen$lambda$9(State<? extends Map<String, Long>> state) {
        return (Map) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Map<String, Map<MenuItem, Integer>> BillingScreen$lambda$10(State<? extends Map<String, ? extends Map<MenuItem, Integer>>> state) {
        return (Map) state.getValue();
    }

    private static final CustomerHistoryResponse BillingScreen$lambda$11(State<CustomerHistoryResponse> state) {
        return (CustomerHistoryResponse) state.getValue();
    }

    private static final List<StaffUser> BillingScreen$lambda$12(State<? extends List<StaffUser>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final BillingFlowState BillingScreen$lambda$13(State<? extends BillingFlowState> state) {
        return (BillingFlowState) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$14(State<String> state) {
        return (String) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final TableItem BillingScreen$lambda$15(State<TableItem> state) {
        return (TableItem) state.getValue();
    }

    private static final boolean BillingScreen$lambda$16(State<Boolean> state) {
        return ((Boolean) state.getValue()).booleanValue();
    }

    private static final String BillingScreen$lambda$17(State<String> state) {
        return (String) state.getValue();
    }

    private static final Boolean BillingScreen$lambda$18(State<Boolean> state) {
        return (Boolean) state.getValue();
    }

    private static final Integer BillingScreen$lambda$19(State<Integer> state) {
        return (Integer) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final PosSettings BillingScreen$lambda$20(State<PosSettings> state) {
        return (PosSettings) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final List<OptionGroup> BillingScreen$lambda$21(State<? extends List<OptionGroup>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final int BillingScreen$lambda$22(State<Integer> state) {
        return ((Number) state.getValue()).intValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$23(State<String> state) {
        return (String) state.getValue();
    }

    private static final MenuItem BillingScreen$lambda$25(MutableState<MenuItem> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$30(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$33(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$36(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$39(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$42(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$45(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$48(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$51(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$54(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$57(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$60(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$63(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$66(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$69(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$72(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final boolean BillingScreen$lambda$75(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$76(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$78(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final boolean BillingScreen$lambda$81(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$82(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$84(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$85(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$87(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$88(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$90(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void BillingScreen$lambda$91(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$93(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$94(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$96(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$97(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final void BillingScreen$lambda$100(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$99(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final boolean BillingScreen$lambda$102(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$103(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$105(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$106(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$108(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$109(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$111(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$112(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final boolean BillingScreen$lambda$114(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$115(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    private static final String BillingScreen$lambda$117(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$120(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$123(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final boolean BillingScreen$lambda$126(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    private static final void BillingScreen$lambda$127(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final boolean BillingScreen$lambda$130(MutableState<Boolean> mutableState) {
        return mutableState.getValue().booleanValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void BillingScreen$lambda$131(MutableState<Boolean> mutableState, boolean z) {
        mutableState.setValue(Boolean.valueOf(z));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$137$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit BillingScreen$lambda$139(long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C286@14567L62:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1849796314, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:286)");
            }
            TextKt.m3069TextNvy7gAk("POS Order processed successfully!", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit BillingScreen$lambda$138(final BillingViewModel $billingViewModel, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C289@14721L40,290@14807L41,288@14679L268:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1536504737, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:288)");
            }
            ComposerKt.sourceInformationMarkerStart($composer, -887695607, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda25
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$138$0$0;
                        BillingScreen$lambda$138$0$0 = BillingScreenKt.BillingScreen$lambda$138$0$0(BillingViewModel.this);
                        return BillingScreen$lambda$138$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.TextButton((Function0) rememberedValue, null, false, null, ButtonDefaults.INSTANCE.m2132textButtonColorsro_MJ88(0L, ColorKt.getSaSGreen(), 0L, 0L, $composer, ButtonDefaults.$stable << 12, 13), null, null, null, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$932245662$app(), $composer, 805306368, 494);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$138$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.goBack();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$0$1(long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C320@15954L90:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1798388617, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:320)");
            }
            IconKt.m2517Iconww6aTOc(ArrowBackKt.getArrowBack(Icons.INSTANCE.getDefault()), "Back", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), $TextPrimary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.fetchTablesAndActiveOrders();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearCart();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("DINEIN");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$0$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("TAKEAWAY_DELIVERY");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("QUICK_BILL");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$1$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("PREORDER");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$5$0$0(final List $departments, final MutableState $selectedDepartment$delegate, final long $InputDark, final long $TextSecondary, final long $CardBorderDark, LazyListScope LazyRow) {
        Intrinsics.checkNotNullParameter(LazyRow, "$this$LazyRow");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((String) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(String str) {
                return null;
            }
        };
        LazyRow.items($departments.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($departments.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$0$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                String BillingScreen$lambda$36;
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if (!$composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    $composer.skipToGroupEnd();
                    return;
                }
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                }
                int i = $dirty & 14;
                final String str = (String) $departments.get(it);
                $composer.startReplaceGroup(-1706214935);
                ComposerKt.sourceInformation($composer, "CN(dept)*473@24455L29,474@24538L74,475@24686L379,481@25139L355,471@24322L1214:BillingScreen.kt#7ez3px");
                BillingScreen$lambda$36 = BillingScreenKt.BillingScreen$lambda$36($selectedDepartment$delegate);
                boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$36, str);
                ComposerKt.sourceInformationMarkerStart($composer, 1607534469, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = $composer.changed($selectedDepartment$delegate) | ((((i & 112) ^ 48) > 32 && $composer.changed(str)) || (i & 48) == 32);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                    final MutableState mutableState = $selectedDepartment$delegate;
                    Object obj = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$4$1$1$1$1$1
                        @Override // kotlin.jvm.functions.Function0
                        public /* bridge */ /* synthetic */ Unit invoke() {
                            invoke2();
                            return Unit.INSTANCE;
                        }

                        /* renamed from: invoke, reason: avoid collision after fix types in other method */
                        public final void invoke2() {
                            mutableState.setValue(str);
                        }
                    };
                    $composer.updateRememberedValue(obj);
                    rememberedValue = obj;
                }
                ComposerKt.sourceInformationMarkerEnd($composer);
                ChipKt.FilterChip(areEqual, (Function0) rememberedValue, ComposableLambdaKt.rememberComposableLambda(660067317, true, new Function2<Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$4$1$1$1$2
                    @Override // kotlin.jvm.functions.Function2
                    public /* bridge */ /* synthetic */ Unit invoke(Composer composer, Integer num) {
                        invoke(composer, num.intValue());
                        return Unit.INSTANCE;
                    }

                    public final void invoke(Composer $composer2, int $changed2) {
                        ComposerKt.sourceInformation($composer2, "C474@24540L70:BillingScreen.kt#7ez3px");
                        if (!$composer2.shouldExecute(($changed2 & 3) != 2, $changed2 & 1)) {
                            $composer2.skipToGroupEnd();
                            return;
                        }
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventStart(660067317, $changed2, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:474)");
                        }
                        String upperCase = str.toUpperCase(Locale.ROOT);
                        Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
                        TextKt.m3069TextNvy7gAk(upperCase, null, 0L, null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 1597440, 0, 262062);
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventEnd();
                        }
                    }
                }, $composer, 54), null, false, null, null, null, FilterChipDefaults.INSTANCE.m2456filterChipColorsXqyqHi0($InputDark, $TextSecondary, 0L, 0L, 0L, 0L, 0L, ColorKt.getSaSGreen(), 0L, Color.INSTANCE.m5131getWhite0d7_KjU(), 0L, 0L, $composer, 805306368, FilterChipDefaults.$stable << 6, 3452), null, FilterChipDefaults.INSTANCE.m2455filterChipBorder_7El2pE(true, areEqual, $CardBorderDark, ColorKt.getSaSGreen(), 0L, 0L, 0.0f, 0.0f, $composer, (FilterChipDefaults.$stable << 24) | 6, 240), null, $composer, 384, 0, 2808);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$5$1$0(final List $filteredTables, final BillingViewModel $billingViewModel, final State $activeOrders$delegate, final State $tableCarts$delegate, final State $tableStatuses$delegate, final State $tableActiveTimestamps$delegate, final State $posSettings$delegate, final State $selectedTable$delegate, LazyGridScope LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter(LazyVerticalGrid, "$this$LazyVerticalGrid");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((TableItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(TableItem tableItem) {
                return null;
            }
        };
        LazyVerticalGrid.items($filteredTables.size(), null, null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($filteredTables.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new Function4<LazyGridItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$$inlined$items$default$5
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyGridItemScope lazyGridItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyGridItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            /* JADX WARN: Code restructure failed: missing block: B:43:0x0152, code lost:
            
                if (r15 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L72;
             */
            /* JADX WARN: Code restructure failed: missing block: B:65:0x023f, code lost:
            
                if (r13 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L91;
             */
            /* JADX WARN: Multi-variable type inference failed */
            /* JADX WARN: Removed duplicated region for block: B:103:0x0401  */
            /* JADX WARN: Removed duplicated region for block: B:106:0x041d  */
            /* JADX WARN: Removed duplicated region for block: B:109:0x04a9  */
            /* JADX WARN: Removed duplicated region for block: B:114:0x04c3  */
            /* JADX WARN: Removed duplicated region for block: B:119:0x0532  */
            /* JADX WARN: Removed duplicated region for block: B:124:0x0568  */
            /* JADX WARN: Removed duplicated region for block: B:127:? A[RETURN, SYNTHETIC] */
            /* JADX WARN: Removed duplicated region for block: B:129:0x0541  */
            /* JADX WARN: Removed duplicated region for block: B:131:0x04d1  */
            /* JADX WARN: Removed duplicated region for block: B:135:0x0429  */
            /* JADX WARN: Removed duplicated region for block: B:141:0x042e  */
            /* JADX WARN: Removed duplicated region for block: B:148:0x0466  */
            /* JADX WARN: Removed duplicated region for block: B:151:0x0484  */
            /* JADX WARN: Removed duplicated region for block: B:152:0x048d  */
            /* JADX WARN: Removed duplicated region for block: B:160:0x028b  */
            /* JADX WARN: Removed duplicated region for block: B:162:0x033f  */
            /* JADX WARN: Removed duplicated region for block: B:164:0x0294 A[EXC_TOP_SPLITTER, SYNTHETIC] */
            /* JADX WARN: Removed duplicated region for block: B:207:0x0290  */
            /* JADX WARN: Removed duplicated region for block: B:208:0x0243  */
            /* JADX WARN: Removed duplicated region for block: B:64:0x0237  */
            /* JADX WARN: Removed duplicated region for block: B:74:0x036a  */
            /* JADX WARN: Removed duplicated region for block: B:97:0x03d9  */
            /*
                Code decompiled incorrectly, please refer to instructions dump.
                To view partially-correct add '--show-bad-code' argument
            */
            public final void invoke(androidx.compose.foundation.lazy.grid.LazyGridItemScope r39, int r40, androidx.compose.runtime.Composer r41, int r42) {
                /*
                    Method dump skipped, instructions count: 1394
                    To view this dump add '--comments-level debug' option
                */
                throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$5$1$0$$inlined$items$default$5.invoke(androidx.compose.foundation.lazy.grid.LazyGridItemScope, int, androidx.compose.runtime.Composer, int):void");
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0(final MutableState $activeSubTab$delegate, final long $TextSecondary, final State $cart$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C609@33811L25,610@33877L402,607@33697L612,621@34451L24,622@34516L1738,619@34338L1946,653@36430L28,654@36499L408,651@36313L624:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-310271094, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:607)");
            }
            boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "MENU");
            ComposerKt.sourceInformationMarkerStart($composer, -1817773277, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda41
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$0$0$0;
                        BillingScreen$lambda$140$0$6$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$0$0(MutableState.this);
                        return BillingScreen$lambda$140$0$6$0$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(areEqual, (Function0) rememberedValue, null, false, ComposableLambdaKt.rememberComposableLambda(1537569892, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda42
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$6$0$1;
                    BillingScreen$lambda$140$0$6$0$1 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$1($TextSecondary, $activeSubTab$delegate, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$6$0$1;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24576, 492);
            boolean areEqual2 = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "KOT");
            ComposerKt.sourceInformationMarkerStart($composer, -1817752798, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = $composer.changed($activeSubTab$delegate);
            Object rememberedValue2 = $composer.rememberedValue();
            if (changed2 || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda43
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$0$2$0;
                        BillingScreen$lambda$140$0$6$0$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$2$0(MutableState.this);
                        return BillingScreen$lambda$140$0$6$0$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(areEqual2, (Function0) rememberedValue2, null, false, ComposableLambdaKt.rememberComposableLambda(-2001796403, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda44
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$6$0$3;
                    BillingScreen$lambda$140$0$6$0$3 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$3($TextSecondary, $activeSubTab$delegate, $cart$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$6$0$3;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24576, 492);
            boolean areEqual3 = Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING");
            ComposerKt.sourceInformationMarkerStart($composer, -1817689466, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed3 = $composer.changed($activeSubTab$delegate);
            Object rememberedValue3 = $composer.rememberedValue();
            if (changed3 || rememberedValue3 == Composer.INSTANCE.getEmpty()) {
                Object obj3 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda45
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$0$4$0;
                        BillingScreen$lambda$140$0$6$0$4$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$4$0(MutableState.this);
                        return BillingScreen$lambda$140$0$6$0$4$0;
                    }
                };
                $composer.updateRememberedValue(obj3);
                rememberedValue3 = obj3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(areEqual3, (Function0) rememberedValue3, null, false, ComposableLambdaKt.rememberComposableLambda(-1657233044, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda46
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj4, Object obj5) {
                    Unit BillingScreen$lambda$140$0$6$0$5;
                    BillingScreen$lambda$140$0$6$0$5 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$5($TextSecondary, $activeSubTab$delegate, (Composer) obj4, ((Integer) obj5).intValue());
                    return BillingScreen$lambda$140$0$6$0$5;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24576, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$0$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("MENU");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$1(long $TextSecondary, MutableState $activeSubTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C611@33915L330:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1537569892, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:611)");
            }
            FontWeight bold = FontWeight.INSTANCE.getBold();
            TextKt.m3069TextNvy7gAk("Menu", null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "MENU") ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(13), null, bold, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$2$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("KOT");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$3(long $TextSecondary, MutableState $activeSubTab$delegate, State $cart$delegate, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C623@34554L1666:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2001796403, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:623)");
            }
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i3 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1349754700, "C624@34648L354:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk("Order/KOT", null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "KOT") ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            final int sumOfInt = CollectionsKt.sumOfInt(BillingScreen$lambda$4($cart$delegate).values());
            if (sumOfInt > 0) {
                $composer.startReplaceGroup(-1349283811);
                ComposerKt.sourceInformation($composer, "632@35184L28,637@35527L613,633@35257L883");
                SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(6)), $composer, 6);
                SurfaceKt.m2926SurfaceT9BRK9s(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.getCircleShape(), ColorKt.getSaSGreen(), 0L, 0.0f, 0.0f, null, ComposableLambdaKt.rememberComposableLambda(-1798027161, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda11
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$6$0$3$0$0;
                        BillingScreen$lambda$140$0$6$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$0$3$0$0(sumOfInt, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$6$0$3$0$0;
                    }
                }, $composer, 54), $composer, 12582918, MenuKt.InTransitionDuration);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1348280527);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$3$0$0(int $totalItems, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C638@35577L517:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1798027161, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:638)");
            }
            Alignment center = Alignment.INSTANCE.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1192304910, "C639@35672L372:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk(String.valueOf($totalItems), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$4$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("BILLING");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$0$5(long $TextSecondary, MutableState $activeSubTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C655@36537L336:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1657233044, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:655)");
            }
            FontWeight bold = FontWeight.INSTANCE.getBold();
            TextKt.m3069TextNvy7gAk("Billing", null, Intrinsics.areEqual(BillingScreen$lambda$30($activeSubTab$delegate), "BILLING") ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(13), null, bold, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$0$0(BillingViewModel $billingViewModel, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $billingViewModel.setSearchQuery(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$1(long $TextSecondary, State $searchQuery$delegate, Function2 innerTextField, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)693@38913L1790:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if ($composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-555821901, $dirty, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:693)");
            }
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.INSTANCE, 0.0f, 1, null);
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((390 >> 3) & 14) | ((390 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            int $dirty2 = $dirty;
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((390 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i3 = ((390 >> 6) & 112) | 6;
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -886259953, "C697@39208L400,703@39661L39,704@39753L900:BillingScreen.kt#7ez3px");
            IconKt.m2517Iconww6aTOc(SearchKt.getSearch(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), $TextSecondary, $composer, 432, 0);
            SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
            Modifier weight$default = RowScope.weight$default(rowScope, Modifier.INSTANCE, 1.0f, false, 2, null);
            Alignment centerStart = Alignment.INSTANCE.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, weight$default);
            Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
            int i4 = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function02 = constructor2;
                $composer.createNode(function02);
            } else {
                function02 = constructor2;
                $composer.useNode();
            }
            Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl2, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
            int i6 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -2145544710, "C715@40583L16:BillingScreen.kt#7ez3px");
            if (BillingScreen$lambda$3($searchQuery$delegate).length() == 0) {
                $composer.startReplaceGroup(-2145521027);
                ComposerKt.sourceInformation($composer, "709@40144L324");
                TextKt.m3069TextNvy7gAk("Search menu...", null, $TextSecondary, null, TextUnitKt.getSp(13), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24582, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-2145094343);
                $composer.endReplaceGroup();
            }
            innerTextField.invoke($composer, Integer.valueOf($dirty2 & 14));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$2$1$0(boolean $isVeg, MutableState $foodTypeFilter$delegate) {
        $foodTypeFilter$delegate.setValue($isVeg ? "NON-VEG" : "VEG");
        return Unit.INSTANCE;
    }

    private static final long BillingScreen$lambda$140$0$6$1$0$2$2(State<Color> state) {
        return ((Color) state.getValue()).m5104unboximpl();
    }

    private static final float BillingScreen$lambda$140$0$6$1$0$2$3(State<Dp> state) {
        return ((Dp) state.getValue()).m7916unboximpl();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$0$2$5$0(boolean $isVeg, MutableState $foodTypeFilter$delegate) {
        $foodTypeFilter$delegate.setValue($isVeg ? "NON-VEG" : "VEG");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$2$0$0$0(BillingViewModel $billingViewModel, int $tier) {
        $billingViewModel.setPriceTier($tier);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$1$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.loadCatalogAndCategories();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$3$0(final List $sortedItems, final BillingViewModel $billingViewModel, final State $optionGroups$delegate, final State $cart$delegate, final State $oldKotItems$delegate, final State $selectedPriceTier$delegate, final State $currentOrderType$delegate, final MutableState $selectedItemForModifiers$delegate, final State $posSettings$delegate, LazyGridScope LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter(LazyVerticalGrid, "$this$LazyVerticalGrid");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda52
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$140$0$6$1$3$3$0$0;
                BillingScreen$lambda$140$0$6$1$3$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$3$0$0((MenuItem) obj);
                return BillingScreen$lambda$140$0$6$1$3$3$0$0;
            }
        };
        final Function1 function12 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((MenuItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(MenuItem menuItem) {
                return null;
            }
        };
        LazyVerticalGrid.items($sortedItems.size(), new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$$inlined$items$default$2
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($sortedItems.get(index));
            }
        }, null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($sortedItems.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new Function4<LazyGridItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$1$3$3$0$$inlined$items$default$5
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyGridItemScope lazyGridItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyGridItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyGridItemScope $this$items, int it, Composer $composer, int $changed) {
                Object BillingScreen$lambda$4;
                Map BillingScreen$lambda$42;
                Object BillingScreen$lambda$5;
                Map BillingScreen$lambda$52;
                int i;
                int BillingScreen$lambda$22;
                String BillingScreen$lambda$23;
                int i2;
                PosSettings BillingScreen$lambda$20;
                PosSettings BillingScreen$lambda$202;
                PosSettings BillingScreen$lambda$203;
                PosSettings BillingScreen$lambda$204;
                PosSettings BillingScreen$lambda$205;
                PosSettings BillingScreen$lambda$206;
                PosSettings BillingScreen$lambda$207;
                ComposerKt.sourceInformation($composer, "CN(it)539@23988L22:LazyGridDsl.kt#7791vq");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if ($composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    if (ComposerKt.isTraceInProgress()) {
                        ComposerKt.traceEventStart(-1117249557, $dirty, -1, "androidx.compose.foundation.lazy.grid.items.<anonymous> (LazyGridDsl.kt:539)");
                    }
                    int i3 = $dirty & 14;
                    final MenuItem menuItem = (MenuItem) $sortedItems.get(it);
                    $composer.startReplaceGroup(1581317322);
                    ComposerKt.sourceInformation($composer, "CN(item)*854@50575L185,857@50830L199,868@51652L596,876@52317L49,864@51337L1795:BillingScreen.kt#7ez3px");
                    int id = menuItem.getId();
                    BillingScreen$lambda$4 = BillingScreenKt.BillingScreen$lambda$4($cart$delegate);
                    ComposerKt.sourceInformationMarkerStart($composer, 1020839685, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changed = $composer.changed(id) | $composer.changed(BillingScreen$lambda$4);
                    Object rememberedValue = $composer.rememberedValue();
                    if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                        BillingScreen$lambda$42 = BillingScreenKt.BillingScreen$lambda$4($cart$delegate);
                        LinkedHashMap linkedHashMap = new LinkedHashMap();
                        for (Map.Entry entry : BillingScreen$lambda$42.entrySet()) {
                            if (!(((MenuItem) entry.getKey()).getId() == menuItem.getId())) {
                                $dirty = $dirty;
                            } else {
                                linkedHashMap.put(entry.getKey(), entry.getValue());
                                $dirty = $dirty;
                            }
                        }
                        Object valueOf = Integer.valueOf(CollectionsKt.sumOfInt(linkedHashMap.values()));
                        $composer.updateRememberedValue(valueOf);
                        rememberedValue = valueOf;
                    }
                    int intValue = ((Number) rememberedValue).intValue();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    int id2 = menuItem.getId();
                    BillingScreen$lambda$5 = BillingScreenKt.BillingScreen$lambda$5($oldKotItems$delegate);
                    ComposerKt.sourceInformationMarkerStart($composer, 1020847859, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changed2 = $composer.changed(id2) | $composer.changed(BillingScreen$lambda$5);
                    Object rememberedValue2 = $composer.rememberedValue();
                    if (changed2 || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                        BillingScreen$lambda$52 = BillingScreenKt.BillingScreen$lambda$5($oldKotItems$delegate);
                        LinkedHashMap linkedHashMap2 = new LinkedHashMap();
                        for (Map.Entry entry2 : BillingScreen$lambda$52.entrySet()) {
                            int i4 = intValue;
                            boolean z = changed2;
                            if (((MenuItem) entry2.getKey()).getId() == menuItem.getId()) {
                                linkedHashMap2.put(entry2.getKey(), entry2.getValue());
                                changed2 = z;
                                intValue = i4;
                            } else {
                                changed2 = z;
                                intValue = i4;
                            }
                        }
                        i = intValue;
                        Object valueOf2 = Integer.valueOf(CollectionsKt.sumOfInt(linkedHashMap2.values()));
                        $composer.updateRememberedValue(valueOf2);
                        rememberedValue2 = valueOf2;
                    } else {
                        i = intValue;
                    }
                    int intValue2 = ((Number) rememberedValue2).intValue();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    BillingViewModel billingViewModel = $billingViewModel;
                    BillingScreen$lambda$22 = BillingScreenKt.BillingScreen$lambda$22($selectedPriceTier$delegate);
                    BillingScreen$lambda$23 = BillingScreenKt.BillingScreen$lambda$23($currentOrderType$delegate);
                    final MenuItem copy$default = MenuItem.copy$default(menuItem, 0, null, null, null, null, billingViewModel.resolveItemPrice(menuItem, BillingScreen$lambda$22, BillingScreen$lambda$23), null, null, null, null, null, null, null, null, null, null, null, null, null, null, 1048543, null);
                    ComposerKt.sourceInformationMarkerStart($composer, 1020874560, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changed3 = $composer.changed($optionGroups$delegate) | ((((i3 & 112) ^ 48) > 32 && $composer.changedInstance(menuItem)) || (i3 & 48) == 32) | $composer.changedInstance(copy$default) | $composer.changedInstance($billingViewModel);
                    Object rememberedValue3 = $composer.rememberedValue();
                    if (changed3 || rememberedValue3 == Composer.INSTANCE.getEmpty()) {
                        final BillingViewModel billingViewModel2 = $billingViewModel;
                        final State state = $optionGroups$delegate;
                        final MutableState mutableState = $selectedItemForModifiers$delegate;
                        rememberedValue3 = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$5$2$3$4$1$2$1$1
                            @Override // kotlin.jvm.functions.Function0
                            public /* bridge */ /* synthetic */ Unit invoke() {
                                invoke2();
                                return Unit.INSTANCE;
                            }

                            /* renamed from: invoke, reason: avoid collision after fix types in other method */
                            public final void invoke2() {
                                Iterable BillingScreen$lambda$21;
                                BillingScreen$lambda$21 = BillingScreenKt.BillingScreen$lambda$21(state);
                                Iterable iterable = BillingScreen$lambda$21;
                                MenuItem menuItem2 = menuItem;
                                boolean hasOpts = false;
                                if (!(iterable instanceof Collection) || !((Collection) iterable).isEmpty()) {
                                    Iterator it2 = iterable.iterator();
                                    while (true) {
                                        if (!it2.hasNext()) {
                                            break;
                                        }
                                        Integer itemId = ((OptionGroup) it2.next()).getItemId();
                                        if (((itemId != null && itemId.intValue() == menuItem2.getId()) ? 1 : null) != null) {
                                            hasOpts = true;
                                            break;
                                        }
                                    }
                                }
                                if (!hasOpts) {
                                    billingViewModel2.addToCart(MenuItem.this);
                                } else {
                                    mutableState.setValue(MenuItem.this);
                                }
                            }
                        };
                        $composer.updateRememberedValue(rememberedValue3);
                    }
                    Function0 function0 = (Function0) rememberedValue3;
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerStart($composer, 1020895293, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance = $composer.changedInstance($billingViewModel) | $composer.changedInstance(copy$default);
                    Object rememberedValue4 = $composer.rememberedValue();
                    if (changedInstance || rememberedValue4 == Composer.INSTANCE.getEmpty()) {
                        i2 = intValue2;
                        final BillingViewModel billingViewModel3 = $billingViewModel;
                        Object obj = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$5$2$3$4$1$2$2$1
                            @Override // kotlin.jvm.functions.Function0
                            public /* bridge */ /* synthetic */ Unit invoke() {
                                invoke2();
                                return Unit.INSTANCE;
                            }

                            /* renamed from: invoke, reason: avoid collision after fix types in other method */
                            public final void invoke2() {
                                BillingViewModel.this.removeFromCart(copy$default);
                            }
                        };
                        $composer.updateRememberedValue(obj);
                        rememberedValue4 = obj;
                    } else {
                        i2 = intValue2;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    BillingScreen$lambda$20 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    boolean showCompactItemView = BillingScreen$lambda$20.getShowCompactItemView();
                    BillingScreen$lambda$202 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    String currency = BillingScreen$lambda$202.getCurrency();
                    BillingScreen$lambda$203 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    boolean showItemsCodeDetails = BillingScreen$lambda$203.getShowItemsCodeDetails();
                    BillingScreen$lambda$204 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    int decimalPlaces = BillingScreen$lambda$204.getDecimalPlaces();
                    BillingScreen$lambda$205 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    boolean showItemImage = BillingScreen$lambda$205.getShowItemImage();
                    BillingScreen$lambda$206 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    boolean showItemsDetails = BillingScreen$lambda$206.getShowItemsDetails();
                    BillingScreen$lambda$207 = BillingScreenKt.BillingScreen$lambda$20($posSettings$delegate);
                    BillingScreenKt.MenuItemCard(copy$default, i, i2, function0, (Function0) rememberedValue4, showCompactItemView, currency, showItemsCodeDetails, decimalPlaces, showItemImage, showItemsDetails, BillingScreen$lambda$207.getShowItemsPrepTime(), $composer, MenuItem.$stable, 0, 0);
                    $composer.endReplaceGroup();
                    if (ComposerKt.isTraceInProgress()) {
                        ComposerKt.traceEventEnd();
                        return;
                    }
                    return;
                }
                $composer.skipToGroupEnd();
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Object BillingScreen$lambda$140$0$6$1$3$3$0$0(MenuItem it) {
        Intrinsics.checkNotNullParameter(it, "it");
        return Integer.valueOf(it.getId());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$0$0(MutableState $showCategoryMenu$delegate) {
        BillingScreen$lambda$115($showCategoryMenu$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$1(State $selectedCategory$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C907@54639L534:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1421338564, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:907)");
            }
            String upperCase = BillingScreen$lambda$2($selectedCategory$delegate).toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            TextKt.m3069TextNvy7gAk(upperCase, PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(12), Dp.m7902constructorimpl(6)), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$2$0(MutableState $showCategoryMenu$delegate) {
        BillingScreen$lambda$115($showCategoryMenu$delegate, !BillingScreen$lambda$114($showCategoryMenu$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$0$3(MutableState $showCategoryMenu$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C924@55873L375:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1312497040, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:924)");
            }
            IconKt.m2517Iconww6aTOc(BillingScreen$lambda$114($showCategoryMenu$delegate) ? CloseKt.getClose(Icons.INSTANCE.getDefault()) : ListKt.getList(Icons.INSTANCE.getDefault()), "Categories", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(24)), 0L, $composer, 432, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$1$0(MutableState $showCategoryMenu$delegate) {
        BillingScreen$lambda$115($showCategoryMenu$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2(final BillingViewModel $billingViewModel, long $CardBorderDark, final long $TextSecondary, final long $TextPrimary, final State $selectedCategory$delegate, final MutableState $showCategoryMenu$delegate, State $categories$delegate, ColumnScope DropdownMenu, Composer $composer, int $changed) {
        long m5129getTransparent0d7_KjU;
        long m5129getTransparent0d7_KjU2;
        Intrinsics.checkNotNullParameter(DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation($composer, "C942@57142L1361,959@58567L228,941@57065L2057,967@59171L89,*972@59634L1455,989@61157L243,971@59553L2175:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1817040035, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:941)");
            }
            ComposableLambda rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(-2133946253, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda96
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    Unit BillingScreen$lambda$140$0$6$1$3$4$2$0;
                    BillingScreen$lambda$140$0$6$1$3$4$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$0($TextSecondary, $TextPrimary, $selectedCategory$delegate, (Composer) obj, ((Integer) obj2).intValue());
                    return BillingScreen$lambda$140$0$6$1$3$4$2$0;
                }
            }, $composer, 54);
            ComposerKt.sourceInformationMarkerStart($composer, -1876163961, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda97
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$1$3$4$2$1$0;
                        BillingScreen$lambda$140$0$6$1$3$4$2$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$1$0(BillingViewModel.this, $showCategoryMenu$delegate);
                        return BillingScreen$lambda$140$0$6$1$3$4$2$1$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            Function0 function0 = (Function0) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer);
            Modifier.Companion companion = Modifier.INSTANCE;
            if (Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL")) {
                m5129getTransparent0d7_KjU = Color.m5092copywmQWz5c(r17, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r17) : 0.1f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r17) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r17) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getSaSGreen()) : 0.0f);
            } else {
                m5129getTransparent0d7_KjU = Color.INSTANCE.m5129getTransparent0d7_KjU();
            }
            AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, function0, BackgroundKt.m262backgroundbw27NRU$default(companion, m5129getTransparent0d7_KjU, null, 2, null), null, null, false, null, null, null, $composer, 6, 504);
            DividerKt.m2396HorizontalDivider9IZ8Weo(PaddingKt.m818paddingVpY3zN4$default(Modifier.INSTANCE, Dp.m7902constructorimpl(8), 0.0f, 2, null), 0.0f, $CardBorderDark, $composer, 6, 2);
            Composer composer = $composer;
            for (final CategoryItem categoryItem : BillingScreen$lambda$1($categories$delegate)) {
                final boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), categoryItem.getName());
                ComposableLambda rememberComposableLambda2 = ComposableLambdaKt.rememberComposableLambda(-1755890685, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda98
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj2, Object obj3) {
                        Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$0;
                        BillingScreen$lambda$140$0$6$1$3$4$2$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$2$0(areEqual, $TextSecondary, categoryItem, $TextPrimary, (Composer) obj2, ((Integer) obj3).intValue());
                        return BillingScreen$lambda$140$0$6$1$3$4$2$2$0;
                    }
                }, composer, 54);
                ComposerKt.sourceInformationMarkerStart(composer, -1739789722, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance2 = composer.changedInstance($billingViewModel) | composer.changed(categoryItem);
                Object rememberedValue2 = $composer.rememberedValue();
                if (changedInstance2 || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                    Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda99
                        @Override // kotlin.jvm.functions.Function0
                        public final Object invoke() {
                            Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0;
                            BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0(BillingViewModel.this, categoryItem, $showCategoryMenu$delegate);
                            return BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0;
                        }
                    };
                    $composer.updateRememberedValue(obj2);
                    rememberedValue2 = obj2;
                }
                Function0 function02 = (Function0) rememberedValue2;
                ComposerKt.sourceInformationMarkerEnd(composer);
                Modifier.Companion companion2 = Modifier.INSTANCE;
                if (areEqual) {
                    m5129getTransparent0d7_KjU2 = Color.m5092copywmQWz5c(r23, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r23) : 0.1f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r23) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r23) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getSaSGreen()) : 0.0f);
                } else {
                    m5129getTransparent0d7_KjU2 = Color.INSTANCE.m5129getTransparent0d7_KjU();
                }
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda2, function02, BackgroundKt.m262backgroundbw27NRU$default(companion2, m5129getTransparent0d7_KjU2, null, 2, null), null, null, false, null, null, null, $composer, 6, 504);
                composer = $composer;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$0(long $TextSecondary, long $TextPrimary, State $selectedCategory$delegate, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C943@57200L1249:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2133946253, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:943)");
            }
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i3 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1340185481, "C944@57314L483,950@57858L29,951@57948L443:BillingScreen.kt#7ez3px");
            IconKt.m2517Iconww6aTOc(AppsKt.getApps(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL") ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), $composer, 6);
            TextKt.m3069TextNvy7gAk("ALL", null, Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL") ? ColorKt.getSaSGreen() : $TextPrimary, null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$1$0(BillingViewModel $billingViewModel, MutableState $showCategoryMenu$delegate) {
        $billingViewModel.setCategory("ALL");
        BillingScreen$lambda$115($showCategoryMenu$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$0(boolean $isSelected, long $TextSecondary, CategoryItem $cat, long $TextPrimary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C973@59696L1335:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1755890685, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:973)");
            }
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i3 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1449241377, "C974@59814L494,980@60373L29,981@60467L502:BillingScreen.kt#7ez3px");
            IconKt.m2517Iconww6aTOc(RestaurantKt.getRestaurant(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), $isSelected ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), $composer, 6);
            String upperCase = $cat.getName().toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            FontWeight.Companion companion = FontWeight.INSTANCE;
            TextKt.m3069TextNvy7gAk(upperCase, null, $isSelected ? ColorKt.getSaSGreen() : $TextPrimary, null, TextUnitKt.getSp(13), null, $isSelected ? companion.getBold() : companion.getMedium(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$3$4$2$2$1$0(BillingViewModel $billingViewModel, CategoryItem $cat, MutableState $showCategoryMenu$delegate) {
        $billingViewModel.setCategory($cat.getName());
        BillingScreen$lambda$115($showCategoryMenu$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$5$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("KOT");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$6(final MutableState $activeSubTab$delegate, int $totalItems, long $TextSecondary, double $totalPrice, State $posSettings$delegate, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        long m5092copywmQWz5c;
        Function0 function03;
        Function0 function04;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1017@63029L3162:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1156069808, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1017)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(14));
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i3 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -594410146, "C1024@63528L1671,1047@65420L39,1046@65318L24,1045@65248L897:BillingScreen.kt#7ez3px");
            Alignment.Vertical centerVertically2 = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically2, $composer, ((384 >> 3) & 14) | ((384 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
            int i4 = ((((384 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function02 = constructor2;
                $composer.createNode(function02);
            } else {
                function02 = constructor2;
                $composer.useNode();
            }
            Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance2 = RowScopeInstance.INSTANCE;
            int i6 = ((384 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 20111056, "C1025@63634L682,1034@64369L40,1035@64462L687:BillingScreen.kt#7ez3px");
            Modifier clip = ClipKt.clip(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(36)), RoundedCornerShapeKt.getCircleShape());
            m5092copywmQWz5c = Color.m5092copywmQWz5c(r65, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r65) : 0.15f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r65) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r65) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getSaSGreen()) : 0.0f);
            Modifier m262backgroundbw27NRU$default = BackgroundKt.m262backgroundbw27NRU$default(clip, m5092copywmQWz5c, null, 2, null);
            Alignment center = Alignment.INSTANCE.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, m262backgroundbw27NRU$default);
            Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
            int i7 = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function03 = constructor3;
                $composer.createNode(function03);
            } else {
                function03 = constructor3;
                $composer.useNode();
            }
            Composer m4364constructorimpl3 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl3, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
            int i9 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1104227703, "C1032@64174L88:BillingScreen.kt#7ez3px");
            IconKt.m2517Iconww6aTOc(ShoppingCartKt.getShoppingCart(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), ColorKt.getSaSGreen(), $composer, 432, 0);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), $composer, 6);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier2 = Modifier.INSTANCE;
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier2);
            Function0 constructor4 = ComposeUiNode.INSTANCE.getConstructor();
            int i10 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function04 = constructor4;
                $composer.createNode(function04);
            } else {
                function04 = constructor4;
                $composer.useNode();
            }
            Composer m4364constructorimpl4 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl4, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl4, currentCompositionLocalMap4, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl4, Integer.valueOf(hashCode4), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl4, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl4, materializeModifier4, ComposeUiNode.INSTANCE.getSetModifier());
            int i11 = (i10 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i12 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1546503911, "C1036@64527L75,1037@64659L436:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk($totalItems + " items selected", null, $TextSecondary, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
            TextKt.m3069TextNvy7gAk(BillingScreen$lambda$20($posSettings$delegate).getCurrency() + " " + formatPrice($totalPrice, BillingScreen$lambda$20($posSettings$delegate)), null, ColorKt.getSaSGreen(), null, TextUnitKt.getSp(16), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonColors m2121buttonColorsro_MJ88 = ButtonDefaults.INSTANCE.m2121buttonColorsro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14);
            RoundedCornerShape m1124RoundedCornerShape0680j_4 = RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16));
            PaddingValues m810PaddingValuesYgX7TsA = PaddingKt.m810PaddingValuesYgX7TsA(Dp.m7902constructorimpl(14), Dp.m7902constructorimpl(6));
            ComposerKt.sourceInformationMarkerStart($composer, 2059090148, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda18
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$1$6$0$1$0;
                        BillingScreen$lambda$140$0$6$1$6$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$1$6$0$1$0(MutableState.this);
                        return BillingScreen$lambda$140$0$6$1$6$0$1$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) rememberedValue, null, false, m1124RoundedCornerShape0680j_4, m2121buttonColorsro_MJ88, null, null, m810PaddingValuesYgX7TsA, null, ComposableSingletons$BillingScreenKt.INSTANCE.m8493getLambda$563310628$app(), $composer, 817889280, 358);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$1$6$0$1$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("KOT");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$1$0$0(Context $context) {
        Toast.makeText($context, "Remote KOT triggered", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$3$1$0(State $cart$delegate, final long $CardDark, final long $CardBorderDark, final long $TextPrimary, final long $TextSecondary, final State $posSettings$delegate, final long $InputDark, final BillingViewModel $billingViewModel, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final List list = CollectionsKt.toList(BillingScreen$lambda$4($cart$delegate).entrySet());
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda28
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$140$0$6$2$3$1$0$0;
                BillingScreen$lambda$140$0$6$2$3$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$3$1$0$0((Map.Entry) obj);
                return BillingScreen$lambda$140$0$6$2$3$1$0$0;
            }
        };
        final Function1 function12 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((Map.Entry<? extends MenuItem, ? extends Integer>) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(Map.Entry<? extends MenuItem, ? extends Integer> entry) {
                return null;
            }
        };
        LazyColumn.items(list.size(), new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$$inlined$items$default$2
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(list.get(index));
            }
        }, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(list.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$2$3$1$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if (!$composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    $composer.skipToGroupEnd();
                    return;
                }
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                }
                int i = $dirty & 14;
                Map.Entry entry = (Map.Entry) list.get(it);
                $composer.startReplaceGroup(1121980266);
                ComposerKt.sourceInformation($composer, "CN(entry)*1153@72956L37,1155@73151L8531,1151@72778L8904:BillingScreen.kt#7ez3px");
                MenuItem menuItem = (MenuItem) entry.getKey();
                int intValue = ((Number) entry.getValue()).intValue();
                double price = menuItem.getPrice() * intValue;
                CardKt.Card(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), null, CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-597632434, true, new BillingScreenKt$BillingScreen$7$1$5$3$3$2$1$2$1(menuItem, $TextPrimary, intValue, $TextSecondary, $posSettings$delegate, $InputDark, $billingViewModel), $composer, 54), $composer, 196614, 10);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Object BillingScreen$lambda$140$0$6$2$3$1$0$0(Map.Entry it) {
        Intrinsics.checkNotNullParameter(it, "it");
        int id = ((MenuItem) it.getKey()).getId();
        double price = ((MenuItem) it.getKey()).getPrice();
        List<SelectedModifier> selectedModifiers = ((MenuItem) it.getKey()).getSelectedModifiers();
        int hashCode = selectedModifiers != null ? selectedModifiers.hashCode() : 0;
        String kitchenNote = ((MenuItem) it.getKey()).getKitchenNote();
        int hashCode2 = kitchenNote != null ? kitchenNote.hashCode() : 0;
        String priceLabel = ((MenuItem) it.getKey()).getPriceLabel();
        if (priceLabel == null) {
            priceLabel = "";
        }
        return id + "_" + price + "_" + hashCode + "_" + hashCode2 + "_" + priceLabel;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$0$0(Context $context, MutableState $isComplimentaryOrder$delegate) {
        BillingScreen$lambda$82($isComplimentaryOrder$delegate, !BillingScreen$lambda$81($isComplimentaryOrder$delegate));
        Toast.makeText($context, BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? "Complimentary mode enabled" : "Complimentary mode disabled", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$1(long $TextSecondary, MutableState $isComplimentaryOrder$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1266@83171L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1574583601, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1266)");
            }
            IconKt.m2517Iconww6aTOc(RedeemKt.getRedeem(Icons.INSTANCE.getDefault()), "Complimentary", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$2$0(Context $context) {
        Toast.makeText($context, "Offers/Coupons opened", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$3(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1280@84138L372:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1640391258, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1280)");
            }
            IconKt.m2517Iconww6aTOc(BookmarkBorderKt.getBookmarkBorder(Icons.INSTANCE.getDefault()), "Offers", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$4$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$4$5(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1289@84790L115:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-291566023, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1289)");
            }
            IconKt.m2517Iconww6aTOc(NoteAddKt.getNoteAdd(Icons.INSTANCE.getDefault()), "Add Note", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$0$0(MutableState $showCountryDropdown$delegate) {
        BillingScreen$lambda$127($showCountryDropdown$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$2$0(MutableState $showCountryDropdown$delegate) {
        BillingScreen$lambda$127($showCountryDropdown$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$3(final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final long $TextPrimary, final MutableState $showCountryDropdown$delegate, ColumnScope DropdownMenu, Composer $composer, int $changed) {
        Modifier modifier;
        Composer composer = $composer;
        Intrinsics.checkNotNullParameter(DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation(composer, "C*1329@87894L675,1338@88637L433,1328@87813L1527:BillingScreen.kt#7ez3px");
        boolean z = true;
        if (!composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1466467357, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1327)");
            }
            for (final CountryCodeItem countryCodeItem : countryCodes) {
                PaddingValues m810PaddingValuesYgX7TsA = PaddingKt.m810PaddingValuesYgX7TsA(Dp.m7902constructorimpl(10), Dp.m7902constructorimpl(2));
                Modifier m848height3ABfNKs = SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(36));
                ComposableLambda rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(607386034, z, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda26
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$0;
                        BillingScreen$lambda$140$0$6$2$5$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$0$3$0$0(CountryCodeItem.this, $TextPrimary, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$6$2$5$0$3$0$0;
                    }
                }, composer, 54);
                ComposerKt.sourceInformationMarkerStart(composer, -127543757, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = composer.changed($selectedCountryCode$delegate) | composer.changed(countryCodeItem) | composer.changed($selectedCountryFlag$delegate) | composer.changed($selectedDialCode$delegate);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                    modifier = m848height3ABfNKs;
                    rememberedValue = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda27
                        @Override // kotlin.jvm.functions.Function0
                        public final Object invoke() {
                            Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0;
                            BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0(CountryCodeItem.this, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $showCountryDropdown$delegate);
                            return BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0;
                        }
                    };
                    $composer.updateRememberedValue(rememberedValue);
                } else {
                    modifier = m848height3ABfNKs;
                }
                ComposerKt.sourceInformationMarkerEnd(composer);
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, modifier, null, null, false, null, m810PaddingValuesYgX7TsA, null, composer, 12583302, 376);
                composer = $composer;
                z = true;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$0(CountryCodeItem $country, long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1330@87956L555:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(607386034, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1330)");
            }
            TextKt.m3069TextNvy7gAk($country.getFlag() + " " + $country.getCode() + " (" + $country.getDialCode() + ") - " + $country.getName(), null, $TextPrimary, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 1, 0, null, null, $composer, 24576, 24960, 241642);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$0$3$0$1$0(CountryCodeItem $country, MutableState $selectedCountryCode$delegate, MutableState $selectedCountryFlag$delegate, MutableState $selectedDialCode$delegate, MutableState $showCountryDropdown$delegate) {
        $selectedCountryCode$delegate.setValue($country.getCode());
        $selectedCountryFlag$delegate.setValue($country.getFlag());
        $selectedDialCode$delegate.setValue($country.getDialCode());
        BillingScreen$lambda$127($showCountryDropdown$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$0$0(BillingViewModel $billingViewModel, MutableState $customerPhone$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerPhone$delegate.setValue(it);
        $billingViewModel.searchCustomers(it);
        return Unit.INSTANCE;
    }

    private static final List<SearchedCustomer> BillingScreen$lambda$140$0$6$2$5$1$1(State<? extends List<SearchedCustomer>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$2$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$3(State $searchResults$delegate, final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final MutableState $customerPhone$delegate, final MutableState $customerName$delegate, final MutableState $customerAddress$delegate, final BillingViewModel $billingViewModel, final long $TextPrimary, final long $TextSecondary, ColumnScope DropdownMenu, Composer $composer, int $changed) {
        Composer composer;
        Composer composer2 = $composer;
        Intrinsics.checkNotNullParameter(DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation(composer2, "C*1376@91481L1753,1398@93302L1119,1375@91400L3075:BillingScreen.kt#7ez3px");
        boolean z = true;
        if (!composer2.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1249425484, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1374)");
            }
            for (final SearchedCustomer searchedCustomer : BillingScreen$lambda$140$0$6$2$5$1$1($searchResults$delegate)) {
                ComposableLambda rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(300936512, z, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda232
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$0;
                        BillingScreen$lambda$140$0$6$2$5$1$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$1$3$0$0(SearchedCustomer.this, $TextPrimary, $TextSecondary, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$6$2$5$1$3$0$0;
                    }
                }, composer2, 54);
                ComposerKt.sourceInformationMarkerStart(composer2, -618833553, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance = composer2.changedInstance($billingViewModel) | composer2.changed(searchedCustomer) | composer2.changed($selectedCountryCode$delegate) | composer2.changed($selectedCountryFlag$delegate) | composer2.changed($selectedDialCode$delegate) | composer2.changed($customerPhone$delegate) | composer2.changed($customerName$delegate) | composer2.changed($customerAddress$delegate);
                Object rememberedValue = $composer.rememberedValue();
                if (changedInstance) {
                    composer = $composer;
                } else {
                    composer = $composer;
                    if (rememberedValue != Composer.INSTANCE.getEmpty()) {
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        composer2 = $composer;
                        AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, null, null, null, false, null, null, null, composer2, 6, 508);
                        z = true;
                    }
                }
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda233
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0;
                        BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0(SearchedCustomer.this, $billingViewModel, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $customerPhone$delegate, $customerName$delegate, $customerAddress$delegate);
                        return BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0;
                    }
                };
                composer.updateRememberedValue(obj);
                rememberedValue = obj;
                ComposerKt.sourceInformationMarkerEnd($composer);
                composer2 = $composer;
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, null, null, null, false, null, null, null, composer2, 6, 508);
                z = true;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$0(SearchedCustomer $customer, long $TextPrimary, long $TextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C1377@91543L1633:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(300936512, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1377)");
            }
            Modifier m818paddingVpY3zN4$default = PaddingKt.m818paddingVpY3zN4$default(Modifier.INSTANCE, 0.0f, Dp.m7902constructorimpl(4), 1, null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m818paddingVpY3zN4$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((6 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i3 = ((6 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 713271629, "C1378@91662L447,1384@92174L345:BillingScreen.kt#7ez3px");
            String name = $customer.getName();
            if (name == null) {
                name = "Customer";
            }
            TextKt.m3069TextNvy7gAk(name, null, $TextPrimary, null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
            String number = $customer.getNumber();
            if (number == null) {
                number = "";
            }
            TextKt.m3069TextNvy7gAk(number, null, $TextSecondary, null, TextUnitKt.getSp(10), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
            String address = $customer.getAddress();
            if (!(address == null || StringsKt.isBlank(address))) {
                $composer.startReplaceGroup(714195149);
                ComposerKt.sourceInformation($composer, "1390@92693L355");
                TextKt.m3069TextNvy7gAk($customer.getAddress(), null, $TextSecondary, null, TextUnitKt.getSp(9), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(714667000);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$1$3$0$1$0(SearchedCustomer $customer, BillingViewModel $billingViewModel, MutableState $selectedCountryCode$delegate, MutableState $selectedCountryFlag$delegate, MutableState $selectedDialCode$delegate, MutableState $customerPhone$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate) {
        Object obj;
        String str;
        String fullPhone = $customer.getNumber();
        if (fullPhone == null) {
            fullPhone = "";
        }
        Triple parsed = parsePhoneNumber(fullPhone);
        $selectedCountryCode$delegate.setValue(parsed.getFirst());
        $selectedCountryFlag$delegate.setValue(parsed.getSecond());
        Iterator<T> it = countryCodes.iterator();
        while (true) {
            if (!it.hasNext()) {
                obj = null;
                break;
            }
            obj = it.next();
            if (Intrinsics.areEqual(((CountryCodeItem) obj).getCode(), parsed.getFirst())) {
                break;
            }
        }
        CountryCodeItem country = (CountryCodeItem) obj;
        if (country == null || (str = country.getDialCode()) == null) {
            str = "+91";
        }
        $selectedDialCode$delegate.setValue(str);
        $customerPhone$delegate.setValue(parsed.getThird());
        String name = $customer.getName();
        if (name == null) {
            name = "";
        }
        $customerName$delegate.setValue(name);
        String address = $customer.getAddress();
        $customerAddress$delegate.setValue(address != null ? address : "");
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$2$0(MutableState $customerName$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerName$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$3$0(BillingViewModel $billingViewModel, Context $context, MutableState $customerPhone$delegate, MutableState $showHistoryDialog$delegate) {
        if (!StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            $billingViewModel.fetchCustomerHistory(BillingScreen$lambda$42($customerPhone$delegate));
            BillingScreen$lambda$94($showHistoryDialog$delegate, true);
        } else {
            Toast.makeText($context, "Please enter customer mobile first", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$4(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1436@95959L114:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(181650192, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1436)");
            }
            IconKt.m2517Iconww6aTOc(HistoryKt.getHistory(Icons.INSTANCE.getDefault()), "History", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$5$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$6(long $TextSecondary, MutableState $selectedWaiter$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1441@96341L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(247457849, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1441)");
            }
            IconKt.m2517Iconww6aTOc(RoomServiceKt.getRoomService(Icons.INSTANCE.getDefault()), "Waiter", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), BillingScreen$lambda$78($selectedWaiter$delegate) != null ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$5$7$0(MutableState $ebillEnabled$delegate, boolean it) {
        BillingScreen$lambda$76($ebillEnabled$delegate, it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$0$0(MutableState $customerAddress$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerAddress$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$1$0(BillingViewModel $billingViewModel, final Context $context, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate) {
        if (!StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            String fullNumber = BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
            $billingViewModel.saveCustomer(BillingScreen$lambda$39($customerName$delegate), fullNumber, BillingScreen$lambda$45($customerAddress$delegate), new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda101
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    Unit BillingScreen$lambda$140$0$6$2$6$1$0$0;
                    BillingScreen$lambda$140$0$6$2$6$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$6$1$0$0($context, ((Boolean) obj).booleanValue(), (String) obj2);
                    return BillingScreen$lambda$140$0$6$2$6$1$0$0;
                }
            });
        } else {
            Toast.makeText($context, "Please enter a mobile number", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$1$0$0(Context $context, boolean success, String msg) {
        Intrinsics.checkNotNullParameter(msg, "msg");
        Toast.makeText($context, msg, 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$3$0(MutableState $kotNote$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $kotNote$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$4$0(MutableState $coversCount$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $coversCount$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$6$5$0(MutableState $customerPhone$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $kotNote$delegate, MutableState $coversCount$delegate, MutableState $ebillEnabled$delegate, MutableState $selectedWaiter$delegate, MutableState $isComplimentaryOrder$delegate) {
        $customerPhone$delegate.setValue("");
        $customerName$delegate.setValue("");
        $customerAddress$delegate.setValue("");
        $kotNote$delegate.setValue("");
        $coversCount$delegate.setValue("");
        BillingScreen$lambda$76($ebillEnabled$delegate, false);
        $selectedWaiter$delegate.setValue(null);
        BillingScreen$lambda$82($isComplimentaryOrder$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$0$0(BillingViewModel $billingViewModel, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, MutableState $kotNote$delegate, MutableState $selectedWaiter$delegate, final MutableState $activeSubTab$delegate) {
        String str;
        if (StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            str = "";
        } else {
            str = BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        }
        String fullCustomerNumber = str;
        $billingViewModel.saveKOT(BillingScreen$lambda$39($customerName$delegate), fullCustomerNumber, BillingScreen$lambda$45($customerAddress$delegate), BillingScreen$lambda$48($orderType$delegate), BillingScreen$lambda$69($kotNote$delegate), BillingScreen$lambda$78($selectedWaiter$delegate), false, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda12
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$2$9$0$0$0;
                BillingScreen$lambda$140$0$6$2$9$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$9$0$0$0(MutableState.this, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$2$9$0$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$0$0$0(MutableState $activeSubTab$delegate, boolean success) {
        if (success) {
            $activeSubTab$delegate.setValue("BILLING");
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$1(State $isLoading$delegate, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-596952544, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1577)");
            }
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(1646457535);
                ComposerKt.sourceInformation($composer, "1578@105859L99");
                ProgressIndicatorKt.m2724CircularProgressIndicator4lLiAd8(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(14)), Color.INSTANCE.m5131getWhite0d7_KjU(), Dp.m7902constructorimpl(2), 0L, 0, 0.0f, $composer, 438, 56);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(1646666289);
                ComposerKt.sourceInformation($composer, "1580@106070L81");
                TextKt.m3069TextNvy7gAk("Save", null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597830, 0, 262058);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$2$0(BillingViewModel $billingViewModel, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, MutableState $kotNote$delegate, MutableState $selectedWaiter$delegate, final Context $context, final MutableState $activeSubTab$delegate) {
        String str;
        if (StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate))) {
            str = "";
        } else {
            str = BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        }
        String fullCustomerNumber = str;
        $billingViewModel.saveKOT(BillingScreen$lambda$39($customerName$delegate), fullCustomerNumber, BillingScreen$lambda$45($customerAddress$delegate), BillingScreen$lambda$48($orderType$delegate), BillingScreen$lambda$69($kotNote$delegate), BillingScreen$lambda$78($selectedWaiter$delegate), true, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda105
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$2$9$2$0$0;
                BillingScreen$lambda$140$0$6$2$9$2$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$2$9$2$0$0($context, $activeSubTab$delegate, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$2$9$2$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$2$0$0(Context $context, MutableState $activeSubTab$delegate, boolean success) {
        if (success) {
            $activeSubTab$delegate.setValue("BILLING");
            Toast.makeText($context, "KOT Saved & Printed", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$2$9$3(State $isLoading$delegate, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1768318949, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1608)");
            }
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(2079158244);
                ComposerKt.sourceInformation($composer, "1609@108174L99");
                ProgressIndicatorKt.m2724CircularProgressIndicator4lLiAd8(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(14)), Color.INSTANCE.m5131getWhite0d7_KjU(), Dp.m7902constructorimpl(2), 0L, 0, 0.0f, $composer, 438, 56);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(2079359310);
                ComposerKt.sourceInformation($composer, "1611@108377L89");
                TextKt.m3069TextNvy7gAk("Print & Save", null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597830, 0, 262058);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$0$0$0$0(MutableState $showOldKotDialog$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$0$0$1$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$2$1$0(Map $billingItems, final long $CardDark, final long $CardBorderDark, final long $TextPrimary, final long $TextSecondary, final State $posSettings$delegate, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final List list = CollectionsKt.toList($billingItems.entrySet());
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda238
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$140$0$6$3$2$1$0$0;
                BillingScreen$lambda$140$0$6$3$2$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$2$1$0$0((Map.Entry) obj);
                return BillingScreen$lambda$140$0$6$3$2$1$0$0;
            }
        };
        final Function1 function12 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((Map.Entry<? extends MenuItem, ? extends Integer>) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(Map.Entry<? extends MenuItem, ? extends Integer> entry) {
                return null;
            }
        };
        LazyColumn.items(list.size(), new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$$inlined$items$default$2
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(list.get(index));
            }
        }, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(list.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$6$3$2$1$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if (!$composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    $composer.skipToGroupEnd();
                    return;
                }
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                }
                int i = $dirty & 14;
                Map.Entry entry = (Map.Entry) list.get(it);
                $composer.startReplaceGroup(72420653);
                ComposerKt.sourceInformation($composer, "CN(entry)*1724@116373L37,1726@116566L2518,1722@116197L2887:BillingScreen.kt#7ez3px");
                final MenuItem menuItem = (MenuItem) entry.getKey();
                final int intValue = ((Number) entry.getValue()).intValue();
                final double price = menuItem.getPrice() * intValue;
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                CardColors m2141cardColorsro_MJ88 = CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14);
                BorderStroke m288BorderStrokecXLIe8U = BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark);
                final long j = $TextPrimary;
                final long j2 = $TextSecondary;
                final State state = $posSettings$delegate;
                CardKt.Card(fillMaxWidth$default, null, m2141cardColorsro_MJ88, null, m288BorderStrokecXLIe8U, ComposableLambdaKt.rememberComposableLambda(1657871375, true, new Function3<ColumnScope, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$5$4$3$2$1$2$1
                    @Override // kotlin.jvm.functions.Function3
                    public /* bridge */ /* synthetic */ Unit invoke(ColumnScope columnScope, Composer composer, Integer num) {
                        invoke(columnScope, composer, num.intValue());
                        return Unit.INSTANCE;
                    }

                    public final void invoke(ColumnScope Card, Composer $composer2, int $changed2) {
                        Function0 function0;
                        Function0 function02;
                        Composer composer;
                        String displayName;
                        PosSettings BillingScreen$lambda$20;
                        PosSettings BillingScreen$lambda$202;
                        String formatPrice;
                        PosSettings BillingScreen$lambda$203;
                        PosSettings BillingScreen$lambda$204;
                        String formatPrice2;
                        Intrinsics.checkNotNullParameter(Card, "$this$Card");
                        ComposerKt.sourceInformation($composer2, "C1727@116624L2406:BillingScreen.kt#7ez3px");
                        if (!$composer2.shouldExecute(($changed2 & 17) != 16, $changed2 & 1)) {
                            $composer2.skipToGroupEnd();
                            return;
                        }
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventStart(1657871375, $changed2, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1727)");
                        }
                        Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(12));
                        Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
                        Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
                        int i2 = intValue;
                        long j3 = j;
                        double d = price;
                        MenuItem menuItem2 = menuItem;
                        long j4 = j2;
                        State<PosSettings> state2 = state;
                        ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                        MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, ((438 >> 3) & 14) | ((438 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, m816padding3ABfNKs);
                        Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
                        int i3 = ((((438 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function0 = constructor;
                            $composer2.createNode(function0);
                        } else {
                            function0 = constructor;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
                        int i4 = (i3 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                        int i5 = ((438 >> 6) & 112) | 6;
                        RowScope rowScope = RowScopeInstance.INSTANCE;
                        ComposerKt.sourceInformationMarkerStart($composer2, -1517020751, "C1732@117077L519,1736@117657L598,1744@118316L656:BillingScreen.kt#7ez3px");
                        Modifier weight$default = RowScope.weight$default(rowScope, Modifier.INSTANCE, 1.0f, false, 2, null);
                        ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                        MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer2, ((0 >> 3) & 14) | ((0 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        CompositionLocalMap currentCompositionLocalMap2 = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer2, weight$default);
                        Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                        int i6 = ((((0 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function02 = constructor2;
                            $composer2.createNode(function02);
                        } else {
                            function02 = constructor2;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl2, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                        int i7 = (i6 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                        ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
                        int i8 = ((0 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1148121678, "C1733@117182L168,1734@117415L119:BillingScreen.kt#7ez3px");
                        if (menuItem2.getPriceLabel() != null) {
                            composer = $composer2;
                            displayName = menuItem2.getDisplayName() + " (" + menuItem2.getPriceLabel() + ")";
                        } else {
                            composer = $composer2;
                            displayName = menuItem2.getDisplayName();
                        }
                        TextKt.m3069TextNvy7gAk(displayName, null, j3, null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer, 1597440, 0, 262058);
                        BillingScreen$lambda$20 = BillingScreenKt.BillingScreen$lambda$20(state2);
                        String currency = BillingScreen$lambda$20.getCurrency();
                        double price2 = menuItem2.getPrice();
                        BillingScreen$lambda$202 = BillingScreenKt.BillingScreen$lambda$20(state2);
                        formatPrice = BillingScreenKt.formatPrice(price2, BillingScreen$lambda$202);
                        Composer composer2 = composer;
                        TextKt.m3069TextNvy7gAk(currency + " " + formatPrice + " x " + i2, null, j4, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer2, 24576, 0, 262122);
                        ComposerKt.sourceInformationMarkerEnd(composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        $composer2.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        TextKt.m3069TextNvy7gAk(String.valueOf(i2), SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(60)), j3, null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, TextAlign.m7748boximpl(TextAlign.INSTANCE.m7755getCentere0LSkKk()), 0L, 0, false, 0, 0, null, null, $composer2, 1597488, 0, 261032);
                        BillingScreen$lambda$203 = BillingScreenKt.BillingScreen$lambda$20(state2);
                        String currency2 = BillingScreen$lambda$203.getCurrency();
                        BillingScreen$lambda$204 = BillingScreenKt.BillingScreen$lambda$20(state2);
                        formatPrice2 = BillingScreenKt.formatPrice(d, BillingScreen$lambda$204);
                        TextKt.m3069TextNvy7gAk(currency2 + " " + formatPrice2, SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(80)), ColorKt.getSaSGreen(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, TextAlign.m7748boximpl(TextAlign.INSTANCE.m7756getEnde0LSkKk()), 0L, 0, false, 0, 0, null, null, $composer2, 1597488, 0, 261032);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        $composer2.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventEnd();
                        }
                    }
                }, $composer, 54), $composer, 196614, 10);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Object BillingScreen$lambda$140$0$6$3$2$1$0$0(Map.Entry it) {
        Intrinsics.checkNotNullParameter(it, "it");
        int id = ((MenuItem) it.getKey()).getId();
        double price = ((MenuItem) it.getKey()).getPrice();
        List<SelectedModifier> selectedModifiers = ((MenuItem) it.getKey()).getSelectedModifiers();
        int hashCode = selectedModifiers != null ? selectedModifiers.hashCode() : 0;
        String kitchenNote = ((MenuItem) it.getKey()).getKitchenNote();
        int hashCode2 = kitchenNote != null ? kitchenNote.hashCode() : 0;
        String priceLabel = ((MenuItem) it.getKey()).getPriceLabel();
        if (priceLabel == null) {
            priceLabel = "";
        }
        return id + "_" + price + "_" + hashCode + "_" + hashCode2 + "_" + priceLabel;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$0$0(Context $context, MutableState $isComplimentaryOrder$delegate) {
        BillingScreen$lambda$82($isComplimentaryOrder$delegate, !BillingScreen$lambda$81($isComplimentaryOrder$delegate));
        Toast.makeText($context, BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? "Complimentary mode enabled" : "Complimentary mode disabled", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$1(long $TextSecondary, MutableState $isComplimentaryOrder$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1780@120709L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-464879886, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1780)");
            }
            IconKt.m2517Iconww6aTOc(RedeemKt.getRedeem(Icons.INSTANCE.getDefault()), "Complimentary", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), BillingScreen$lambda$81($isComplimentaryOrder$delegate) ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$2$0(Context $context) {
        Toast.makeText($context, "Offers/Coupons opened", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$3(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1794@121676L372:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-399072229, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1794)");
            }
            IconKt.m2517Iconww6aTOc(BookmarkBorderKt.getBookmarkBorder(Icons.INSTANCE.getDefault()), "Offers", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$4$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$5(long $TextSecondary, MutableState $kotNote$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1806@122458L403:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1963937786, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1806)");
            }
            IconKt.m2517Iconww6aTOc(NoteAddKt.getNoteAdd(Icons.INSTANCE.getDefault()), "Note", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), !StringsKt.isBlank(BillingScreen$lambda$69($kotNote$delegate)) ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$6$0(MutableState $showCustomerDialog$delegate) {
        BillingScreen$lambda$100($showCustomerDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$7(long $TextSecondary, MutableState $customerPhone$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1818@123275L478:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(31980505, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1818)");
            }
            IconKt.m2517Iconww6aTOc(PersonKt.getPerson(Icons.INSTANCE.getDefault()), "Customer info", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), (StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) && StringsKt.isBlank(BillingScreen$lambda$39($customerName$delegate)) && StringsKt.isBlank(BillingScreen$lambda$45($customerAddress$delegate))) ? $TextSecondary : ColorKt.getSaSGreen(), $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$8$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$9(long $TextSecondary, MutableState $selectedWaiter$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1830@124165L411:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1899976776, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1830)");
            }
            IconKt.m2517Iconww6aTOc(RoomServiceKt.getRoomService(Icons.INSTANCE.getDefault()), "Waiter", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), BillingScreen$lambda$78($selectedWaiter$delegate) != null ? ColorKt.getSaSGreen() : $TextSecondary, $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$10$0(MutableState $ebillEnabled$delegate) {
        BillingScreen$lambda$76($ebillEnabled$delegate, !BillingScreen$lambda$75($ebillEnabled$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$3$11$0$0(MutableState $ebillEnabled$delegate, boolean it) {
        BillingScreen$lambda$76($ebillEnabled$delegate, it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$0$0(MutableState $showPreviewDialog$delegate) {
        BillingScreen$lambda$97($showPreviewDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$1$0(BillingViewModel $billingViewModel, Order $activeOrder, Map $billingItems, double $subtotal, double $discount, double $cgst, double $sgst, double $serviceCharge, double $deliveryCharge, double $finalTotal, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, MutableState $paymentMethod$delegate) {
        String str;
        String str2;
        String username;
        if ($activeOrder == null || (str = $activeOrder.getBillNo()) == null) {
            str = "NEW";
        }
        String str3 = str;
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String str4 = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str2 = BillingScreen$lambda$15.getTableName()) == null) {
            str2 = "Direct";
        }
        String str5 = str2;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        if ($user == null || (username = $user.getName()) == null) {
            username = $user != null ? $user.getUsername() : null;
            if (username == null) {
                username = "admin";
            }
        }
        BillingViewModel.triggerBillPrint$default($billingViewModel, str3, BillingScreen$lambda$39, str4, BillingScreen$lambda$45, BillingScreen$lambda$48, $billingItems, $subtotal, $discount, $cgst, $sgst, $serviceCharge, $deliveryCharge, $finalTotal, str5, BillingScreen$lambda$78, $advancePaid, $remainingBalance, BillingScreen$lambda$51, username, null, 0.0d, 1572864, null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$2$0(MutableState $showDiscountDialog$delegate) {
        BillingScreen$lambda$85($showDiscountDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$3(double $discount, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1955@133389L424:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1703341726, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1955)");
            }
            IconKt.m2517Iconww6aTOc(LocalOfferKt.getLocalOffer(Icons.INSTANCE.getDefault()), "Discount", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), $discount > 0.0d ? Color.INSTANCE.m5132getYellow0d7_KjU() : Color.INSTANCE.m5131getWhite0d7_KjU(), $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$4$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$5$1$5(double $serviceCharge, double $deliveryCharge, MutableState $orderType$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1966@134180L488:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1696252029, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1966)");
            }
            IconKt.m2517Iconww6aTOc(AccountBalanceWalletKt.getAccountBalanceWallet(Icons.INSTANCE.getDefault()), "Charges", SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(18)), ($serviceCharge > 0.0d || $deliveryCharge > 0.0d || Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER")) ? Color.INSTANCE.m5132getYellow0d7_KjU() : Color.INSTANCE.m5131getWhite0d7_KjU(), $composer, 432, 0);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$0$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        String fullCustomerNumber = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                $billingViewModel.settleOrder(BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0, (65536 & r59) != 0 ? "SETTLE" : "SAVE", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda29
                    @Override // kotlin.jvm.functions.Function1
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
                        BillingScreen$lambda$140$0$6$3$6$0$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$0$0$0($context, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
                    }
                });
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        $billingViewModel.settleOrder(BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0, (65536 & r59) != 0 ? "SETTLE" : "SAVE", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda29
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
                BillingScreen$lambda$140$0$6$3$6$0$0$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$0$0$0($context, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$3$6$0$0$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$0$0$0(Context $context, boolean success) {
        if (success) {
            Toast.makeText($context, "Bill Saved", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$1$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        String fullCustomerNumber = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                $billingViewModel.settleOrder(BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0 ? true : true, (65536 & r59) != 0 ? "SETTLE" : "PRINT", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda239
                    @Override // kotlin.jvm.functions.Function1
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
                        BillingScreen$lambda$140$0$6$3$6$0$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$1$0$0($context, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
                    }
                });
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        $billingViewModel.settleOrder(BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0 ? true : true, (65536 & r59) != 0 ? "SETTLE" : "PRINT", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda239
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
                BillingScreen$lambda$140$0$6$3$6$0$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$0$1$0$0($context, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$3$6$0$1$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$1$0$0(Context $context, boolean success) {
        if (success) {
            Toast.makeText($context, "Bill Saved & Printed", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$0$2$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$106($showPaymentDialog$delegate, true);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$1$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerName$delegate, MutableState $customerAddress$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        String fullCustomerNumber = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                $billingViewModel.settleOrder(BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0, (65536 & r59) != 0 ? "SETTLE" : "SETTLE", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda17
                    @Override // kotlin.jvm.functions.Function1
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$6$3$6$1$0$0;
                        BillingScreen$lambda$140$0$6$3$6$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$1$0$0($context, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$6$3$6$1$0$0;
                    }
                });
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        $billingViewModel.settleOrder(BillingScreen$lambda$39, fullCustomerNumber, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0, (65536 & r59) != 0 ? "SETTLE" : "SETTLE", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda17
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$6$3$6$1$0$0;
                BillingScreen$lambda$140$0$6$3$6$1$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$6$3$6$1$0$0($context, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$6$3$6$1$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$1$0$0(Context $context, boolean success) {
        if (success) {
            Toast.makeText($context, "Bill Settled successfully", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$6$3$6$2(State $isLoading$delegate, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(485025286, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2106)");
            }
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(1118424665);
                ComposerKt.sourceInformation($composer, "2107@145525L99");
                ProgressIndicatorKt.m2724CircularProgressIndicator4lLiAd8(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(14)), Color.INSTANCE.m5131getWhite0d7_KjU(), Dp.m7902constructorimpl(2), 0L, 0, 0.0f, $composer, 438, 56);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(1118623716);
                ComposerKt.sourceInformation($composer, "2109@145726L88");
                TextKt.m3069TextNvy7gAk("Settle Bill", null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597830, 0, 262058);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$7$0(MutableState $showDiscountDialog$delegate) {
        BillingScreen$lambda$85($showDiscountDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8(long $CardDark, final long $CardBorderDark, final Map $billingItems, final long $TextSecondary, final MutableState $discountInput$delegate, final State $posSettings$delegate, final long $InputDark, final MutableState $showDiscountDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2125@146379L37,2128@146583L4607,2123@146268L4922:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1299720154, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2123)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-482418828, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda91
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$8$0;
                    BillingScreen$lambda$140$0$8$0 = BillingScreenKt.BillingScreen$lambda$140$0$8$0($CardBorderDark, $billingItems, $TextSecondary, $discountInput$delegate, $posSettings$delegate, $InputDark, $showDiscountDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$8$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:63:0x0985, code lost:
    
        if (r7 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L73;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$8$0(long r135, java.util.Map r137, final long r138, final androidx.compose.runtime.MutableState r140, androidx.compose.runtime.State r141, long r142, final androidx.compose.runtime.MutableState r144, final long r145, androidx.compose.foundation.layout.ColumnScope r147, androidx.compose.runtime.Composer r148, int r149) {
        /*
            Method dump skipped, instructions count: 2556
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$8$0(long, java.util.Map, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, long, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final String BillingScreen$lambda$140$0$8$0$0$1(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$3$0(MutableState $discountVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $discountVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$4(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2146@147512L72:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1060687588, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2146)");
            }
            TextKt.m3069TextNvy7gAk("Discount Amount (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$6$0$0$0(double $amt, State $posSettings$delegate, MutableState $discountVal$delegate) {
        $discountVal$delegate.setValue(formatPrice($amt, BillingScreen$lambda$20($posSettings$delegate)));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$7$0$0(MutableState $showDiscountDialog$delegate) {
        BillingScreen$lambda$85($showDiscountDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$7$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2192@150472L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-395816941, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2192)");
            }
            TextKt.m3069TextNvy7gAk("Cancel", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$8$0$0$7$2$0(MutableState $discountVal$delegate, MutableState $discountInput$delegate, MutableState $showDiscountDialog$delegate) {
        $discountInput$delegate.setValue(BillingScreen$lambda$140$0$8$0$0$1($discountVal$delegate));
        BillingScreen$lambda$85($showDiscountDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$9$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10(long $CardDark, final long $CardBorderDark, final long $TextSecondary, final MutableState $serviceChargeInput$delegate, final MutableState $deliveryChargeInput$delegate, final MutableState $preOrderIdInput$delegate, final MutableState $advancePaidInput$delegate, final long $InputDark, final MutableState $orderType$delegate, final State $posSettings$delegate, final State $activeFlow$delegate, final MutableState $showChargesDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2214@151467L37,2217@151671L7565,2212@151356L7880:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1078987569, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2212)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-1631428451, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda5
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$10$0;
                    BillingScreen$lambda$140$0$10$0 = BillingScreenKt.BillingScreen$lambda$140$0$10$0($TextSecondary, $CardBorderDark, $serviceChargeInput$delegate, $deliveryChargeInput$delegate, $preOrderIdInput$delegate, $advancePaidInput$delegate, $InputDark, $orderType$delegate, $posSettings$delegate, $activeFlow$delegate, $showChargesDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$10$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:56:0x06b1, code lost:
    
        if (r15 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L62;
     */
    /* JADX WARN: Code restructure failed: missing block: B:63:0x07f8, code lost:
    
        if (r1 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L72;
     */
    /* JADX WARN: Code restructure failed: missing block: B:98:0x0a6b, code lost:
    
        if (r6 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L95;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$10$0(final long r150, long r152, final androidx.compose.runtime.MutableState r154, final androidx.compose.runtime.MutableState r155, final androidx.compose.runtime.MutableState r156, final androidx.compose.runtime.MutableState r157, long r158, final androidx.compose.runtime.MutableState r160, final androidx.compose.runtime.State r161, androidx.compose.runtime.State r162, androidx.compose.runtime.MutableState r163, final long r164, androidx.compose.foundation.layout.ColumnScope r166, androidx.compose.runtime.Composer r167, int r168) {
        /*
            Method dump skipped, instructions count: 3419
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$10$0(long, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$0$0$0$0(String $type, MutableState $orderType$delegate) {
        $orderType$delegate.setValue($type);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$1$0(MutableState $serviceChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $serviceChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$2(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2261@154295L71:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-469879795, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2261)");
            }
            TextKt.m3069TextNvy7gAk("Service Charge (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$3$0(MutableState $deliveryChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $deliveryChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$4(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2277@155315L72:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1113469230, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2277)");
            }
            TextKt.m3069TextNvy7gAk("Delivery Charge (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$5$0(MutableState $preOrderIdInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $preOrderIdInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$6(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2294@156427L43:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-833100037, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2294)");
            }
            TextKt.m3069TextNvy7gAk("Pre-Order ID", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$7$0(MutableState $advancePaidInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $advancePaidInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$8(long $TextSecondary, State $posSettings$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2307@157285L69:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-278935836, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2307)");
            }
            TextKt.m3069TextNvy7gAk("Advance Paid (" + BillingScreen$lambda$20($posSettings$delegate).getCurrency() + ")", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 0, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$9$0$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$9$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2329@158664L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-11393668, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2329)");
            }
            TextKt.m3069TextNvy7gAk("Cancel", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$10$0$0$9$2$0(MutableState $showChargesDialog$delegate) {
        BillingScreen$lambda$88($showChargesDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$11$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12(long $CardDark, long $CardBorderDark, final MutableState $selectedWaiter$delegate, final long $InputDark, final long $TextPrimary, final State $staffList$delegate, final MutableState $showWaiterDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2348@159511L37,2351@159715L4477,2346@159400L4792:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1512951250, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2346)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-2065392132, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda65
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$12$0;
                    BillingScreen$lambda$140$0$12$0 = BillingScreenKt.BillingScreen$lambda$140$0$12$0(MutableState.this, $InputDark, $TextPrimary, $staffList$delegate, $showWaiterDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$12$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:56:0x0208, code lost:
    
        if (r5 == null) goto L33;
     */
    /* JADX WARN: Removed duplicated region for block: B:38:0x05f5  */
    /* JADX WARN: Removed duplicated region for block: B:41:0x0670  */
    /* JADX WARN: Removed duplicated region for block: B:45:0x0603  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$12$0(final androidx.compose.runtime.MutableState r82, final long r83, final long r85, androidx.compose.runtime.State r87, androidx.compose.runtime.MutableState r88, androidx.compose.foundation.layout.ColumnScope r89, androidx.compose.runtime.Composer r90, int r91) {
        /*
            Method dump skipped, instructions count: 1660
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$12$0(androidx.compose.runtime.MutableState, long, long, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$1$0(final List $waiters, final long $InputDark, final MutableState $selectedWaiter$delegate, final MutableState $showWaiterDialog$delegate, final long $TextPrimary, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((String) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(String str) {
                return null;
            }
        };
        LazyColumn.items($waiters.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($waiters.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$12$0$0$1$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                String BillingScreen$lambda$78;
                int i;
                Function0 function0;
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                boolean z = true;
                if ($composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    if (ComposerKt.isTraceInProgress()) {
                        ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                    }
                    int i2 = $dirty & 14;
                    final String str = (String) $waiters.get(it);
                    $composer.startReplaceGroup(1201504033);
                    ComposerKt.sourceInformation($composer, "CN(waiter)*2389@162079L192,2384@161726L1094:BillingScreen.kt#7ez3px");
                    BillingScreen$lambda$78 = BillingScreenKt.BillingScreen$lambda$78($selectedWaiter$delegate);
                    boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$78, str);
                    Modifier m262backgroundbw27NRU$default = BackgroundKt.m262backgroundbw27NRU$default(ClipKt.clip(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(8))), areEqual ? ColorKt.getSaSGreen() : $InputDark, null, 2, null);
                    ComposerKt.sourceInformationMarkerStart($composer, -515418322, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changed = $composer.changed($selectedWaiter$delegate);
                    if ((((i2 & 112) ^ 48) <= 32 || !$composer.changed(str)) && (i2 & 48) != 32) {
                        z = false;
                    }
                    boolean z2 = changed | z;
                    Object rememberedValue = $composer.rememberedValue();
                    if (z2 || rememberedValue == Composer.INSTANCE.getEmpty()) {
                        i = 0;
                        final MutableState mutableState = $selectedWaiter$delegate;
                        final MutableState mutableState2 = $showWaiterDialog$delegate;
                        Object obj = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$11$1$1$1$1$1$1$1
                            @Override // kotlin.jvm.functions.Function0
                            public /* bridge */ /* synthetic */ Unit invoke() {
                                invoke2();
                                return Unit.INSTANCE;
                            }

                            /* renamed from: invoke, reason: avoid collision after fix types in other method */
                            public final void invoke2() {
                                mutableState.setValue(str);
                                BillingScreenKt.BillingScreen$lambda$91(mutableState2, false);
                            }
                        };
                        $composer.updateRememberedValue(obj);
                        rememberedValue = obj;
                    } else {
                        i = 0;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    Modifier m817paddingVpY3zN4 = PaddingKt.m817paddingVpY3zN4(ClickableKt.m297clickableoSLSa3U$default(m262backgroundbw27NRU$default, false, null, null, null, (Function0) rememberedValue, 15, null), Dp.m7902constructorimpl(16), Dp.m7902constructorimpl(12));
                    int i3 = i;
                    ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                    MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(Alignment.INSTANCE.getTopStart(), false);
                    ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                    int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, i));
                    CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
                    Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m817paddingVpY3zN4);
                    Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
                    int i4 = ((((i3 << 3) & 112) << 6) & 896) | 6;
                    ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!($composer.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    $composer.startReusableNode();
                    if ($composer.getInserting()) {
                        function0 = constructor;
                        $composer.createNode(function0);
                    } else {
                        function0 = constructor;
                        $composer.useNode();
                    }
                    Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
                    Updater.m4372setimpl(m4364constructorimpl, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                    Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                    Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                    Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                    Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
                    int i5 = (i4 >> 6) & 14;
                    ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                    BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
                    int i6 = ((i3 >> 6) & 112) | 6;
                    ComposerKt.sourceInformationMarkerStart($composer, -156549060, "C2395@162443L339:BillingScreen.kt#7ez3px");
                    TextKt.m3069TextNvy7gAk(str, null, areEqual ? Color.INSTANCE.m5131getWhite0d7_KjU() : $TextPrimary, null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, ((i2 >> 3) & 14) | 1597440, 0, 262058);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endNode();
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    $composer.endReplaceGroup();
                    if (ComposerKt.isTraceInProgress()) {
                        ComposerKt.traceEventEnd();
                        return;
                    }
                    return;
                }
                $composer.skipToGroupEnd();
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$2$0$0(MutableState $selectedWaiter$delegate, MutableState $showWaiterDialog$delegate) {
        $selectedWaiter$delegate.setValue(null);
        BillingScreen$lambda$91($showWaiterDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$2$1$0(MutableState $showWaiterDialog$delegate) {
        BillingScreen$lambda$91($showWaiterDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$12$0$0$2$2(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2424@164046L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-844723685, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2424)");
            }
            TextKt.m3069TextNvy7gAk("Close", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$13$0(BillingViewModel $billingViewModel, MutableState $showCustomerDialog$delegate) {
        BillingScreen$lambda$100($showCustomerDialog$delegate, false);
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14(final long $CardDark, final long $CardBorderDark, final MutableState $customerPhone$delegate, final MutableState $customerName$delegate, final MutableState $customerAddress$delegate, final BillingViewModel $billingViewModel, final long $TextSecondary, final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final long $TextPrimary, final long $InputDark, final Context $context, final MutableState $showCustomerDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2439@164565L37,2442@164769L8815,2437@164454L9130:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1946914931, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2437)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(1795611483, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda50
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$14$0;
                    BillingScreen$lambda$140$0$14$0 = BillingScreenKt.BillingScreen$lambda$140$0$14$0($CardBorderDark, $customerPhone$delegate, $customerName$delegate, $customerAddress$delegate, $billingViewModel, $CardDark, $TextSecondary, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $TextPrimary, $InputDark, $context, $showCustomerDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$14$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:33:0x0414, code lost:
    
        if (r7 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L45;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$14$0(long r228, final androidx.compose.runtime.MutableState r230, final androidx.compose.runtime.MutableState r231, final androidx.compose.runtime.MutableState r232, final com.example.sasloopmanager.BillingViewModel r233, long r234, final long r236, final androidx.compose.runtime.MutableState r238, final androidx.compose.runtime.MutableState r239, final androidx.compose.runtime.MutableState r240, final long r241, long r243, final android.content.Context r245, final androidx.compose.runtime.MutableState r246, androidx.compose.foundation.layout.ColumnScope r247, androidx.compose.runtime.Composer r248, int r249) {
        /*
            Method dump skipped, instructions count: 2662
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$14$0(long, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, com.example.sasloopmanager.BillingViewModel, long, long, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, long, android.content.Context, androidx.compose.runtime.MutableState, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final String BillingScreen$lambda$140$0$14$0$0$1(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$140$0$14$0$0$4(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$140$0$14$0$0$7(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$0$0(BillingViewModel $billingViewModel, MutableState $phoneVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $phoneVal$delegate.setValue(it);
        $billingViewModel.searchCustomers(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$1(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2466@166054L46:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(961658757, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2466)");
            }
            TextKt.m3069TextNvy7gAk("Customer Mobile", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final List<SearchedCustomer> BillingScreen$lambda$140$0$14$0$0$9$2(State<? extends List<SearchedCustomer>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$3$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$4(State $dialogSearchResults$delegate, final MutableState $selectedCountryCode$delegate, final MutableState $selectedCountryFlag$delegate, final MutableState $selectedDialCode$delegate, final BillingViewModel $billingViewModel, final long $TextPrimary, final long $TextSecondary, final MutableState $phoneVal$delegate, final MutableState $nameVal$delegate, final MutableState $addressVal$delegate, ColumnScope DropdownMenu, Composer $composer, int $changed) {
        Composer composer = $composer;
        Intrinsics.checkNotNullParameter(DropdownMenu, "$this$DropdownMenu");
        ComposerKt.sourceInformation(composer, "C*2490@167767L1501,2512@169324L970,2489@167698L2638:BillingScreen.kt#7ez3px");
        boolean z = true;
        if (!composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-955569958, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2488)");
            }
            for (final SearchedCustomer searchedCustomer : BillingScreen$lambda$140$0$14$0$0$9$2($dialogSearchResults$delegate)) {
                ComposableLambda rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(1874826190, z, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda13
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$0;
                        BillingScreen$lambda$140$0$14$0$0$9$4$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$14$0$0$9$4$0$0(SearchedCustomer.this, $TextPrimary, $TextSecondary, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$140$0$14$0$0$9$4$0$0;
                    }
                }, composer, 54);
                ComposerKt.sourceInformationMarkerStart(composer, 1461929960, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = composer.changed(searchedCustomer) | composer.changed($selectedCountryCode$delegate) | composer.changed($selectedCountryFlag$delegate) | composer.changed($selectedDialCode$delegate) | composer.changedInstance($billingViewModel);
                Object rememberedValue = $composer.rememberedValue();
                if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                    rememberedValue = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda14
                        @Override // kotlin.jvm.functions.Function0
                        public final Object invoke() {
                            Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0;
                            BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0(SearchedCustomer.this, $billingViewModel, $selectedCountryCode$delegate, $selectedCountryFlag$delegate, $selectedDialCode$delegate, $phoneVal$delegate, $nameVal$delegate, $addressVal$delegate);
                            return BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0;
                        }
                    };
                    $composer.updateRememberedValue(rememberedValue);
                }
                ComposerKt.sourceInformationMarkerEnd(composer);
                AndroidMenu_androidKt.DropdownMenuItem(rememberComposableLambda, (Function0) rememberedValue, null, null, null, false, null, null, null, composer, 6, 508);
                composer = $composer;
                z = true;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$0(SearchedCustomer $customer, long $TextPrimary, long $TextSecondary, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C2491@167817L1405:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1874826190, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2491)");
            }
            Modifier m818paddingVpY3zN4$default = PaddingKt.m818paddingVpY3zN4$default(Modifier.INSTANCE, 0.0f, Dp.m7902constructorimpl(4), 1, null);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m818paddingVpY3zN4$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((6 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i3 = ((6 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1254847947, "C2492@167924L387,2498@168364L297:BillingScreen.kt#7ez3px");
            String name = $customer.getName();
            if (name == null) {
                name = "Customer";
            }
            TextKt.m3069TextNvy7gAk(name, null, $TextPrimary, null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
            String number = $customer.getNumber();
            if (number == null) {
                number = "";
            }
            TextKt.m3069TextNvy7gAk(number, null, $TextSecondary, null, TextUnitKt.getSp(10), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
            String address = $customer.getAddress();
            if (!(address == null || StringsKt.isBlank(address))) {
                $composer.startReplaceGroup(1255644615);
                ComposerKt.sourceInformation($composer, "2504@168811L307");
                TextKt.m3069TextNvy7gAk($customer.getAddress(), null, $TextSecondary, null, TextUnitKt.getSp(9), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(1256047274);
                $composer.endReplaceGroup();
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$9$4$0$1$0(SearchedCustomer $customer, BillingViewModel $billingViewModel, MutableState $selectedCountryCode$delegate, MutableState $selectedCountryFlag$delegate, MutableState $selectedDialCode$delegate, MutableState $phoneVal$delegate, MutableState $nameVal$delegate, MutableState $addressVal$delegate) {
        Object obj;
        String str;
        String fullPhone = $customer.getNumber();
        if (fullPhone == null) {
            fullPhone = "";
        }
        Triple parsed = parsePhoneNumber(fullPhone);
        Iterator<T> it = countryCodes.iterator();
        while (true) {
            if (!it.hasNext()) {
                obj = null;
                break;
            }
            obj = it.next();
            if (Intrinsics.areEqual(((CountryCodeItem) obj).getCode(), parsed.getFirst())) {
                break;
            }
        }
        CountryCodeItem outerCountry = (CountryCodeItem) obj;
        $selectedCountryCode$delegate.setValue(parsed.getFirst());
        $selectedCountryFlag$delegate.setValue(parsed.getSecond());
        if (outerCountry == null || (str = outerCountry.getDialCode()) == null) {
            str = "+91";
        }
        $selectedDialCode$delegate.setValue(str);
        $phoneVal$delegate.setValue(parsed.getThird());
        String name = $customer.getName();
        if (name == null) {
            name = "";
        }
        $nameVal$delegate.setValue(name);
        String address = $customer.getAddress();
        $addressVal$delegate.setValue(address != null ? address : "");
        $billingViewModel.clearSearchResults();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$10$0(MutableState $nameVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $nameVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$11(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2533@170644L44:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1337807157, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2533)");
            }
            TextKt.m3069TextNvy7gAk("Customer Name", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$12$0(MutableState $addressVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $addressVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$13(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2547@171440L47:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1686870988, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2547)");
            }
            TextKt.m3069TextNvy7gAk("Customer Address", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$14$0$0(MutableState $showCustomerDialog$delegate) {
        BillingScreen$lambda$100($showCustomerDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$14$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2567@172624L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2052049839, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2567)");
            }
            TextKt.m3069TextNvy7gAk("Cancel", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$14$0$0$14$2$0(Context $context, MutableState $phoneVal$delegate, MutableState $customerPhone$delegate, MutableState $nameVal$delegate, MutableState $customerName$delegate, MutableState $addressVal$delegate, MutableState $customerAddress$delegate, MutableState $showCustomerDialog$delegate) {
        $customerPhone$delegate.setValue(BillingScreen$lambda$140$0$14$0$0$1($phoneVal$delegate));
        $customerName$delegate.setValue(BillingScreen$lambda$140$0$14$0$0$4($nameVal$delegate));
        $customerAddress$delegate.setValue(BillingScreen$lambda$140$0$14$0$0$7($addressVal$delegate));
        BillingScreen$lambda$100($showCustomerDialog$delegate, false);
        Toast.makeText($context, "Customer Info Saved", 0).show();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$15$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16(long $CardDark, final long $CardBorderDark, final MutableState $kotNote$delegate, final long $TextSecondary, final long $InputDark, final MutableState $showNoteDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2592@173855L37,2595@174059L2806,2590@173744L3121:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1914088684, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2590)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(1361647802, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda85
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$16$0;
                    BillingScreen$lambda$140$0$16$0 = BillingScreenKt.BillingScreen$lambda$140$0$16$0($CardBorderDark, $kotNote$delegate, $TextSecondary, $InputDark, $showNoteDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$16$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:33:0x04fe, code lost:
    
        if (r7 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L45;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$16$0(long r133, final androidx.compose.runtime.MutableState r135, final long r136, long r138, final androidx.compose.runtime.MutableState r140, final long r141, androidx.compose.foundation.layout.ColumnScope r143, androidx.compose.runtime.Composer r144, int r145) {
        /*
            Method dump skipped, instructions count: 1397
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$16$0(long, androidx.compose.runtime.MutableState, long, long, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final String BillingScreen$lambda$140$0$16$0$0$1(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$3$0(MutableState $noteVal$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $noteVal$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$4(long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2613@174922L61:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1771770838, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2613)");
            }
            TextKt.m3069TextNvy7gAk("Order Note / Chef Instructions", null, $TextSecondary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$5$0$0(MutableState $showNoteDialog$delegate) {
        BillingScreen$lambda$103($showNoteDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$5$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2634@176157L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1808953776, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2634)");
            }
            TextKt.m3069TextNvy7gAk("Cancel", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$16$0$0$5$2$0(MutableState $noteVal$delegate, MutableState $kotNote$delegate, MutableState $showNoteDialog$delegate) {
        $kotNote$delegate.setValue(BillingScreen$lambda$140$0$16$0$0$1($noteVal$delegate));
        BillingScreen$lambda$103($showNoteDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$17$0(MutableState $showPreviewDialog$delegate) {
        BillingScreen$lambda$97($showPreviewDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$18(long $CardDark, long $CardBorderDark, final Map $billingItems, final Order $activeOrder, final MutableState $discountInput$delegate, final State $posSettings$delegate, final MutableState $orderType$delegate, final MutableState $serviceChargeInput$delegate, final MutableState $deliveryChargeInput$delegate, final MutableState $isComplimentaryOrder$delegate, final MutableState $advancePaidInput$delegate, final State $selectedTable$delegate, final MutableState $selectedWaiter$delegate, final MutableState $customerName$delegate, final MutableState $customerPhone$delegate, final MutableState $selectedDialCode$delegate, final MutableState $customerAddress$delegate, final long $InputDark, final BillingViewModel $billingViewModel, final MutableState $paymentMethod$delegate, final UserProfile $user, final MutableState $showPreviewDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2656@177141L37,2659@177375L12578,2654@177031L12922:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1480125003, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2654)");
            }
            CardKt.Card(PaddingKt.m817paddingVpY3zN4(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(8), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(8)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(927684121, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda3
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$18$0;
                    BillingScreen$lambda$140$0$18$0 = BillingScreenKt.BillingScreen$lambda$140$0$18$0($billingItems, $activeOrder, $discountInput$delegate, $posSettings$delegate, $orderType$delegate, $serviceChargeInput$delegate, $deliveryChargeInput$delegate, $isComplimentaryOrder$delegate, $advancePaidInput$delegate, $selectedTable$delegate, $selectedWaiter$delegate, $customerName$delegate, $customerPhone$delegate, $selectedDialCode$delegate, $customerAddress$delegate, $InputDark, $billingViewModel, $paymentMethod$delegate, $user, $showPreviewDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$18$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:129:0x0646, code lost:
    
        if (kotlin.text.StringsKt.contains$default(r11, "QTY.", r13, 2, (java.lang.Object) null) == false) goto L126;
     */
    /* JADX WARN: Removed duplicated region for block: B:103:0x0cd3  */
    /* JADX WARN: Removed duplicated region for block: B:108:0x0c14  */
    /* JADX WARN: Removed duplicated region for block: B:109:0x0abe  */
    /* JADX WARN: Removed duplicated region for block: B:110:0x0a00  */
    /* JADX WARN: Removed duplicated region for block: B:111:0x0887  */
    /* JADX WARN: Removed duplicated region for block: B:112:0x074e  */
    /* JADX WARN: Removed duplicated region for block: B:113:0x0729  */
    /* JADX WARN: Removed duplicated region for block: B:133:0x06a1  */
    /* JADX WARN: Removed duplicated region for block: B:135:0x06a9  */
    /* JADX WARN: Removed duplicated region for block: B:138:0x06e8 A[SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:77:0x0726  */
    /* JADX WARN: Removed duplicated region for block: B:80:0x074b  */
    /* JADX WARN: Removed duplicated region for block: B:83:0x0875  */
    /* JADX WARN: Removed duplicated region for block: B:86:0x0881  */
    /* JADX WARN: Removed duplicated region for block: B:89:0x09f0  */
    /* JADX WARN: Removed duplicated region for block: B:92:0x09fc  */
    /* JADX WARN: Removed duplicated region for block: B:95:0x0aac  */
    /* JADX WARN: Removed duplicated region for block: B:98:0x0bd8  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$18$0(final java.util.Map r140, final com.example.sasloopmanager.data.Order r141, androidx.compose.runtime.MutableState r142, androidx.compose.runtime.State r143, final androidx.compose.runtime.MutableState r144, androidx.compose.runtime.MutableState r145, androidx.compose.runtime.MutableState r146, androidx.compose.runtime.MutableState r147, final androidx.compose.runtime.MutableState r148, final androidx.compose.runtime.State r149, final androidx.compose.runtime.MutableState r150, final androidx.compose.runtime.MutableState r151, final androidx.compose.runtime.MutableState r152, final androidx.compose.runtime.MutableState r153, final androidx.compose.runtime.MutableState r154, long r155, final com.example.sasloopmanager.BillingViewModel r157, final androidx.compose.runtime.MutableState r158, final com.example.sasloopmanager.data.UserProfile r159, final androidx.compose.runtime.MutableState r160, final long r161, androidx.compose.foundation.layout.ColumnScope r163, androidx.compose.runtime.Composer r164, int r165) {
        /*
            Method dump skipped, instructions count: 3293
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$18$0(java.util.Map, com.example.sasloopmanager.data.Order, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.MutableState, com.example.sasloopmanager.data.UserProfile, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$18$0$0$7$0$0(MutableState $showPreviewDialog$delegate) {
        BillingScreen$lambda$97($showPreviewDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$18$0$0$7$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C2821@187517L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1374990095, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2821)");
            }
            TextKt.m3069TextNvy7gAk("Close", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$18$0$0$7$2$0(double $finalTotal, BillingViewModel $billingViewModel, Order $activeOrder, Map $billingItems, double $subtotal, double $discount, double $cgst, double $sgst, double $serviceCharge, double $deliveryCharge, UserProfile $user, MutableState $showPreviewDialog$delegate, MutableState $advancePaidInput$delegate, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $selectedDialCode$delegate, MutableState $customerAddress$delegate, MutableState $orderType$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, MutableState $paymentMethod$delegate) {
        String str;
        String str2;
        String username;
        BillingScreen$lambda$97($showPreviewDialog$delegate, false);
        Double doubleOrNull = StringsKt.toDoubleOrNull(BillingScreen$lambda$66($advancePaidInput$delegate));
        double advancePaid = doubleOrNull != null ? doubleOrNull.doubleValue() : 0.0d;
        double remainingBalance = RangesKt.coerceAtLeast($finalTotal - advancePaid, 0.0d);
        if ($activeOrder == null || (str = $activeOrder.getBillNo()) == null) {
            str = "NEW";
        }
        String str3 = str;
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String str4 = StringsKt.isBlank(BillingScreen$lambda$42($customerPhone$delegate)) ? "" : BillingScreen$lambda$117($selectedDialCode$delegate) + BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str2 = BillingScreen$lambda$15.getTableName()) == null) {
            str2 = "Direct";
        }
        String str5 = str2;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        if ($user == null || (username = $user.getName()) == null) {
            username = $user != null ? $user.getUsername() : null;
            if (username == null) {
                username = "admin";
            }
        }
        BillingViewModel.triggerBillPrint$default($billingViewModel, str3, BillingScreen$lambda$39, str4, BillingScreen$lambda$45, BillingScreen$lambda$48, $billingItems, $subtotal, $discount, $cgst, $sgst, $serviceCharge, $deliveryCharge, $finalTotal, str5, BillingScreen$lambda$78, advancePaid, remainingBalance, BillingScreen$lambda$51, username, null, 0.0d, 1572864, null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$19$0(MutableState $showHistoryDialog$delegate) {
        BillingScreen$lambda$94($showHistoryDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20(long $CardDark, final long $CardBorderDark, final long $InputDark, final long $TextSecondary, final State $posSettings$delegate, final long $TextPrimary, final MutableState $customerPhone$delegate, final State $isLoading$delegate, final State $customerHistory$delegate, final MutableState $showHistoryDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2865@190230L37,2868@190434L13376,2863@190119L13691:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1046161322, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2863)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(493720440, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda47
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$20$0;
                    BillingScreen$lambda$140$0$20$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0($InputDark, $CardBorderDark, $TextSecondary, $posSettings$delegate, $TextPrimary, $customerPhone$delegate, $isLoading$delegate, $customerHistory$delegate, $showHistoryDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$20$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0(final long $InputDark, final long $CardBorderDark, final long $TextSecondary, final State $posSettings$delegate, final long $TextPrimary, MutableState $customerPhone$delegate, State $isLoading$delegate, State $customerHistory$delegate, final MutableState $showHistoryDialog$delegate, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Composer composer;
        int i;
        Object obj;
        int i2;
        String str;
        Composer composer2;
        String str2;
        Composer composer3;
        Function0 function02;
        boolean z;
        String str3;
        Function0 function03;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C2869@190460L13328:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(493720440, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2869)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(16));
            Alignment.Horizontal centerHorizontally = Alignment.INSTANCE.getCenterHorizontally();
            Arrangement.Vertical m686spacedBy0680j_4 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(m686spacedBy0680j_4, centerHorizontally, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i3 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i4 = (i3 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i5 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -513497111, "C2874@190746L275,2881@191069L30,2888@191445L769,2883@191129L1085,3048@203525L40,3047@203438L29,3050@203664L98,3046@203388L374:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk("Customer History - " + BillingScreen$lambda$42($customerPhone$delegate), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(16), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerStart($composer, 1091811584, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.INSTANCE.getEmpty()) {
                rememberedValue = SnapshotStateKt__SnapshotStateKt.mutableStateOf$default(0, null, 2, null);
                $composer.updateRememberedValue(rememberedValue);
            }
            final MutableState mutableState = (MutableState) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabRowKt.m2980TabRowpAZo6Ak(BillingScreen$lambda$140$0$20$0$0$1(mutableState), ClipKt.clip(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(8))), $InputDark, ColorKt.getSaSGreen(), null, null, ComposableLambdaKt.rememberComposableLambda(-168477526, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda36
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$20$0$0$3;
                    BillingScreen$lambda$140$0$20$0$0$3 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3(MutableState.this, $TextSecondary, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$3;
                }
            }, $composer, 54), $composer, 1572864, 48);
            if (BillingScreen$lambda$16($isLoading$delegate)) {
                $composer.startReplaceGroup(-512388025);
                ComposerKt.sourceInformation($composer, "2902@192293L313");
                Modifier m848height3ABfNKs = SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(160));
                Alignment center = Alignment.INSTANCE.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, m848height3ABfNKs);
                Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                int i6 = ((((54 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    $composer.createNode(constructor2);
                } else {
                    $composer.useNode();
                }
                Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer);
                Updater.m4372setimpl(m4364constructorimpl2, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                int i7 = (i6 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
                int i8 = ((54 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, -1730913641, "C2906@192529L43:BillingScreen.kt#7ez3px");
                ProgressIndicatorKt.m2724CircularProgressIndicator4lLiAd8(null, ColorKt.getSaSGreen(), 0.0f, 0L, 0, 0.0f, $composer, 0, 61);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
                composer2 = $composer;
                i = 54;
                str = "CC(remember):BillingScreen.kt#9igjgp";
            } else {
                $composer.startReplaceGroup(-511687580);
                ComposerKt.sourceInformation($composer, "");
                CustomerHistoryResponse BillingScreen$lambda$11 = BillingScreen$lambda$11($customerHistory$delegate);
                if (BillingScreen$lambda$11 != null) {
                    List<CustomerOrderHistoryItem> orders = BillingScreen$lambda$11.getOrders();
                    if (orders == null || orders.isEmpty()) {
                        List<CustomerTransactionHistoryItem> transactions = BillingScreen$lambda$11.getTransactions();
                        if (transactions == null || transactions.isEmpty()) {
                            composer = $composer;
                            i = 54;
                            obj = null;
                            i2 = 1;
                        }
                    }
                    $composer.startReplaceGroup(-511075392);
                    ComposerKt.sourceInformation($composer, "");
                    if (BillingScreen$lambda$140$0$20$0$0$1(mutableState) == 0) {
                        $composer.startReplaceGroup(-511179490);
                        ComposerKt.sourceInformation($composer, "");
                        List orders2 = BillingScreen$lambda$11.getOrders();
                        if (orders2 == null) {
                            orders2 = CollectionsKt.emptyList();
                        }
                        if (orders2.isEmpty()) {
                            $composer.startReplaceGroup(-511167245);
                            ComposerKt.sourceInformation($composer, "2921@193532L405");
                            Modifier m848height3ABfNKs2 = SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(160));
                            Alignment center2 = Alignment.INSTANCE.getCenter();
                            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                            MeasurePolicy maybeCachedBoxMeasurePolicy2 = BoxKt.maybeCachedBoxMeasurePolicy(center2, false);
                            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
                            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, m848height3ABfNKs2);
                            Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
                            int i9 = ((((54 << 3) & 112) << 6) & 896) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                            if (!($composer.getApplier() instanceof Applier)) {
                                ComposablesKt.invalidApplier();
                            }
                            $composer.startReusableNode();
                            if ($composer.getInserting()) {
                                function03 = constructor3;
                                $composer.createNode(function03);
                            } else {
                                function03 = constructor3;
                                $composer.useNode();
                            }
                            Composer m4364constructorimpl3 = Updater.m4364constructorimpl($composer);
                            Updater.m4372setimpl(m4364constructorimpl3, maybeCachedBoxMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                            Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                            Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                            Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                            Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
                            int i10 = (i9 >> 6) & 14;
                            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                            BoxScopeInstance boxScopeInstance2 = BoxScopeInstance.INSTANCE;
                            int i11 = ((54 >> 6) & 112) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, 930778778, "C2925@193816L75:BillingScreen.kt#7ez3px");
                            i = 54;
                            z = true;
                            TextKt.m3069TextNvy7gAk("No past orders", null, $TextSecondary, null, 0L, FontStyle.m7434boximpl(FontStyle.INSTANCE.m7443getItalic_LCdwA()), null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262106);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endNode();
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endReplaceGroup();
                            composer3 = $composer;
                            str3 = "CC(remember):BillingScreen.kt#9igjgp";
                        } else {
                            i = 54;
                            z = true;
                            $composer.startReplaceGroup(-510559862);
                            ComposerKt.sourceInformation($composer, "2931@194293L3768,2928@194031L4030");
                            Modifier m850heightInVpY3zN4$default = SizeKt.m850heightInVpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), 0.0f, Dp.m7902constructorimpl(240), 1, null);
                            Arrangement.HorizontalOrVertical m686spacedBy0680j_42 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
                            str3 = "CC(remember):BillingScreen.kt#9igjgp";
                            ComposerKt.sourceInformationMarkerStart($composer, 1091918490, str3);
                            boolean changedInstance = $composer.changedInstance(orders2) | $composer.changed($InputDark) | $composer.changed($CardBorderDark) | $composer.changed($TextSecondary) | $composer.changed($posSettings$delegate) | $composer.changed($TextPrimary);
                            Object rememberedValue2 = $composer.rememberedValue();
                            if (changedInstance || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                                final List list = orders2;
                                rememberedValue2 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda37
                                    @Override // kotlin.jvm.functions.Function1
                                    public final Object invoke(Object obj2) {
                                        Unit BillingScreen$lambda$140$0$20$0$0$7$0;
                                        BillingScreen$lambda$140$0$20$0$0$7$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$7$0(list, $InputDark, $CardBorderDark, $TextSecondary, $TextPrimary, $posSettings$delegate, (LazyListScope) obj2);
                                        return BillingScreen$lambda$140$0$20$0$0$7$0;
                                    }
                                };
                                $composer.updateRememberedValue(rememberedValue2);
                            }
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            LazyDslKt.LazyColumn(m850heightInVpY3zN4$default, null, null, false, m686spacedBy0680j_42, null, null, false, null, (Function1) rememberedValue2, $composer, 24582, 494);
                            composer3 = $composer;
                            composer3.endReplaceGroup();
                        }
                        composer3.endReplaceGroup();
                        str2 = str3;
                    } else {
                        i = 54;
                        $composer.startReplaceGroup(-506399259);
                        ComposerKt.sourceInformation($composer, "");
                        List transactions2 = BillingScreen$lambda$11.getTransactions();
                        if (transactions2 == null) {
                            transactions2 = CollectionsKt.emptyList();
                        }
                        if (transactions2.isEmpty()) {
                            $composer.startReplaceGroup(-506397461);
                            ComposerKt.sourceInformation($composer, "2981@198340L413");
                            Modifier m848height3ABfNKs3 = SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(160));
                            Alignment center3 = Alignment.INSTANCE.getCenter();
                            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                            MeasurePolicy maybeCachedBoxMeasurePolicy3 = BoxKt.maybeCachedBoxMeasurePolicy(center3, false);
                            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                            CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
                            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, m848height3ABfNKs3);
                            Function0 constructor4 = ComposeUiNode.INSTANCE.getConstructor();
                            int i12 = ((((54 << 3) & 112) << 6) & 896) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                            if (!($composer.getApplier() instanceof Applier)) {
                                ComposablesKt.invalidApplier();
                            }
                            $composer.startReusableNode();
                            if ($composer.getInserting()) {
                                function02 = constructor4;
                                $composer.createNode(function02);
                            } else {
                                function02 = constructor4;
                                $composer.useNode();
                            }
                            Composer m4364constructorimpl4 = Updater.m4364constructorimpl($composer);
                            Updater.m4372setimpl(m4364constructorimpl4, maybeCachedBoxMeasurePolicy3, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                            Updater.m4372setimpl(m4364constructorimpl4, currentCompositionLocalMap4, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                            Updater.m4368initimpl(m4364constructorimpl4, Integer.valueOf(hashCode4), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                            Updater.m4370reconcileimpl(m4364constructorimpl4, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                            Updater.m4372setimpl(m4364constructorimpl4, materializeModifier4, ComposeUiNode.INSTANCE.getSetModifier());
                            int i13 = (i12 >> 6) & 14;
                            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                            BoxScopeInstance boxScopeInstance3 = BoxScopeInstance.INSTANCE;
                            int i14 = ((54 >> 6) & 112) | 6;
                            ComposerKt.sourceInformationMarkerStart($composer, 326973915, "C2985@198624L83:BillingScreen.kt#7ez3px");
                            TextKt.m3069TextNvy7gAk("No ledger transactions", null, $TextSecondary, null, 0L, FontStyle.m7434boximpl(FontStyle.INSTANCE.m7443getItalic_LCdwA()), null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262106);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endNode();
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            $composer.endReplaceGroup();
                            composer3 = $composer;
                            str2 = "CC(remember):BillingScreen.kt#9igjgp";
                        } else {
                            final List list2 = transactions2;
                            $composer.startReplaceGroup(-505771943);
                            ComposerKt.sourceInformation($composer, "2991@199109L4105,2988@198847L4367");
                            Modifier m850heightInVpY3zN4$default2 = SizeKt.m850heightInVpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), 0.0f, Dp.m7902constructorimpl(240), 1, null);
                            Arrangement.HorizontalOrVertical m686spacedBy0680j_43 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
                            str2 = "CC(remember):BillingScreen.kt#9igjgp";
                            ComposerKt.sourceInformationMarkerStart($composer, 1092072939, str2);
                            boolean changedInstance2 = $composer.changedInstance(list2) | $composer.changed($InputDark) | $composer.changed($CardBorderDark) | $composer.changed($TextSecondary) | $composer.changed($posSettings$delegate) | $composer.changed($TextPrimary);
                            Object rememberedValue3 = $composer.rememberedValue();
                            if (changedInstance2 || rememberedValue3 == Composer.INSTANCE.getEmpty()) {
                                rememberedValue3 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda38
                                    @Override // kotlin.jvm.functions.Function1
                                    public final Object invoke(Object obj2) {
                                        Unit BillingScreen$lambda$140$0$20$0$0$9$0;
                                        BillingScreen$lambda$140$0$20$0$0$9$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$9$0(list2, $InputDark, $CardBorderDark, $TextPrimary, $TextSecondary, $posSettings$delegate, (LazyListScope) obj2);
                                        return BillingScreen$lambda$140$0$20$0$0$9$0;
                                    }
                                };
                                $composer.updateRememberedValue(rememberedValue3);
                            }
                            ComposerKt.sourceInformationMarkerEnd($composer);
                            LazyDslKt.LazyColumn(m850heightInVpY3zN4$default2, null, null, false, m686spacedBy0680j_43, null, null, false, null, (Function1) rememberedValue3, $composer, 24582, 494);
                            composer3 = $composer;
                            composer3.endReplaceGroup();
                        }
                        composer3.endReplaceGroup();
                    }
                    composer3.endReplaceGroup();
                    composer2 = composer3;
                    str = str2;
                    composer2.endReplaceGroup();
                } else {
                    composer = $composer;
                    i = 54;
                    obj = null;
                    i2 = 1;
                }
                composer.startReplaceGroup(-511814711);
                ComposerKt.sourceInformation(composer, "2911@192873L367");
                Modifier m848height3ABfNKs4 = SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, i2, obj), Dp.m7902constructorimpl(160));
                Alignment center4 = Alignment.INSTANCE.getCenter();
                int i15 = i;
                Composer composer4 = composer;
                ComposerKt.sourceInformationMarkerStart(composer4, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy4 = BoxKt.maybeCachedBoxMeasurePolicy(center4, false);
                ComposerKt.sourceInformationMarkerStart(composer4, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer4, 0));
                CompositionLocalMap currentCompositionLocalMap5 = composer4.getCurrentCompositionLocalMap();
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier(composer4, m848height3ABfNKs4);
                Function0 constructor5 = ComposeUiNode.INSTANCE.getConstructor();
                int i16 = ((((i15 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart(composer4, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!(composer4.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                composer4.startReusableNode();
                if (composer4.getInserting()) {
                    composer4.createNode(constructor5);
                } else {
                    composer4.useNode();
                }
                Composer m4364constructorimpl5 = Updater.m4364constructorimpl(composer4);
                Updater.m4372setimpl(m4364constructorimpl5, maybeCachedBoxMeasurePolicy4, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl5, currentCompositionLocalMap5, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl5, Integer.valueOf(hashCode5), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl5, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl5, materializeModifier5, ComposeUiNode.INSTANCE.getSetModifier());
                int i17 = (i16 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart(composer4, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScopeInstance boxScopeInstance4 = BoxScopeInstance.INSTANCE;
                int i18 = ((i15 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart(composer4, 638640345, "C2915@193125L77:BillingScreen.kt#7ez3px");
                composer2 = composer;
                str = "CC(remember):BillingScreen.kt#9igjgp";
                TextKt.m3069TextNvy7gAk("No history found", null, $TextSecondary, null, 0L, FontStyle.m7434boximpl(FontStyle.INSTANCE.m7443getItalic_LCdwA()), null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer4, 6, 0, 262106);
                ComposerKt.sourceInformationMarkerEnd(composer4);
                ComposerKt.sourceInformationMarkerEnd(composer4);
                composer4.endNode();
                ComposerKt.sourceInformationMarkerEnd(composer4);
                ComposerKt.sourceInformationMarkerEnd(composer4);
                ComposerKt.sourceInformationMarkerEnd(composer4);
                composer2.endReplaceGroup();
                composer2.endReplaceGroup();
            }
            Composer composer5 = composer2;
            ButtonColors m2121buttonColorsro_MJ88 = ButtonDefaults.INSTANCE.m2121buttonColorsro_MJ88($InputDark, 0L, 0L, 0L, composer5, ButtonDefaults.$stable << 12, 14);
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            ComposerKt.sourceInformationMarkerStart(composer5, 1092207391, str);
            Object rememberedValue4 = composer5.rememberedValue();
            if (rememberedValue4 == Composer.INSTANCE.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda39
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$20$0$0$10$0;
                        BillingScreen$lambda$140$0$20$0$0$10$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$10$0(MutableState.this);
                        return BillingScreen$lambda$140$0$20$0$0$10$0;
                    }
                };
                composer5.updateRememberedValue(obj2);
                rememberedValue4 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd(composer5);
            ButtonKt.Button((Function0) rememberedValue4, fillMaxWidth$default, false, null, m2121buttonColorsro_MJ88, null, null, null, null, ComposableLambdaKt.rememberComposableLambda(709228370, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda40
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj3, Object obj4, Object obj5) {
                    Unit BillingScreen$lambda$140$0$20$0$0$11;
                    BillingScreen$lambda$140$0$20$0$0$11 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$11($TextPrimary, (RowScope) obj3, (Composer) obj4, ((Integer) obj5).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$11;
                }
            }, composer5, i), composer5, 805306422, 492);
            ComposerKt.sourceInformationMarkerEnd(composer5);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final int BillingScreen$lambda$140$0$20$0$0$1(MutableState<Integer> mutableState) {
        return mutableState.getValue().intValue();
    }

    private static final void BillingScreen$lambda$140$0$20$0$0$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3(final MutableState $historyTab$delegate, final long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2891@191594L18,2892@191657L124,2889@191479L336,2896@191963L18,2897@192026L124,2894@191848L336:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-168477526, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2889)");
            }
            boolean z = BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 0;
            ComposerKt.sourceInformationMarkerStart($composer, 1301859548, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda234
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$20$0$0$3$0$0;
                        BillingScreen$lambda$140$0$20$0$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$0$0(MutableState.this);
                        return BillingScreen$lambda$140$0$20$0$0$3$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(z, (Function0) rememberedValue, null, false, ComposableLambdaKt.rememberComposableLambda(331796356, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda235
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$20$0$0$3$1;
                    BillingScreen$lambda$140$0$20$0$0$3$1 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$1($TextSecondary, $historyTab$delegate, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$3$1;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24624, 492);
            boolean z2 = BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 1;
            ComposerKt.sourceInformationMarkerStart($composer, 1301871356, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer.rememberedValue();
            if (rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda236
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$20$0$0$3$2$0;
                        BillingScreen$lambda$140$0$20$0$0$3$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$2$0(MutableState.this);
                        return BillingScreen$lambda$140$0$20$0$0$3$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(z2, (Function0) rememberedValue2, null, false, ComposableLambdaKt.rememberComposableLambda(289811181, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda237
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$20$0$0$3$3;
                    BillingScreen$lambda$140$0$20$0$0$3$3 = BillingScreenKt.BillingScreen$lambda$140$0$20$0$0$3$3($TextSecondary, $historyTab$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$20$0$0$3$3;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24624, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$0$0(MutableState $historyTab$delegate) {
        BillingScreen$lambda$140$0$20$0$0$2($historyTab$delegate, 0);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$1(long $TextSecondary, MutableState $historyTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2892@191659L120:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(331796356, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2892)");
            }
            TextKt.m3069TextNvy7gAk("Orders", null, BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 0 ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$2$0(MutableState $historyTab$delegate) {
        BillingScreen$lambda$140$0$20$0$0$2($historyTab$delegate, 1);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$3$3(long $TextSecondary, MutableState $historyTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C2897@192028L120:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(289811181, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2897)");
            }
            TextKt.m3069TextNvy7gAk("Ledger", null, BillingScreen$lambda$140$0$20$0$0$1($historyTab$delegate) == 1 ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$7$0(final List $orders, final long $InputDark, final long $CardBorderDark, final long $TextSecondary, final long $TextPrimary, final State $posSettings$delegate, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((CustomerOrderHistoryItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(CustomerOrderHistoryItem customerOrderHistoryItem) {
                return null;
            }
        };
        LazyColumn.items($orders.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($orders.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$7$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if (!$composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    $composer.skipToGroupEnd();
                    return;
                }
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                }
                int i = $dirty & 14;
                final CustomerOrderHistoryItem customerOrderHistoryItem = (CustomerOrderHistoryItem) $orders.get(it);
                $composer.startReplaceGroup(-193167827);
                ComposerKt.sourceInformation($composer, "CN(order)*2934@194504L38,2937@194790L3175,2933@194420L3545:BillingScreen.kt#7ez3px");
                CardColors m2141cardColorsro_MJ88 = CardDefaults.INSTANCE.m2141cardColorsro_MJ88($InputDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14);
                BorderStroke m288BorderStrokecXLIe8U = BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark);
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                final long j = $TextSecondary;
                final long j2 = $TextPrimary;
                final State state = $posSettings$delegate;
                CardKt.Card(fillMaxWidth$default, null, m2141cardColorsro_MJ88, null, m288BorderStrokecXLIe8U, ComposableLambdaKt.rememberComposableLambda(-1231384433, true, new Function3<ColumnScope, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$19$1$1$5$1$1$1
                    @Override // kotlin.jvm.functions.Function3
                    public /* bridge */ /* synthetic */ Unit invoke(ColumnScope columnScope, Composer composer, Integer num) {
                        invoke(columnScope, composer, num.intValue());
                        return Unit.INSTANCE;
                    }

                    public final void invoke(ColumnScope Card, Composer $composer2, int $changed2) {
                        Function0 function0;
                        Function0 function02;
                        Composer composer;
                        String str;
                        PosSettings BillingScreen$lambda$20;
                        PosSettings BillingScreen$lambda$202;
                        String formatPrice;
                        Intrinsics.checkNotNullParameter(Card, "$this$Card");
                        ComposerKt.sourceInformation($composer2, "C2938@194848L3063:BillingScreen.kt#7ez3px");
                        if (!$composer2.shouldExecute(($changed2 & 17) != 16, $changed2 & 1)) {
                            $composer2.skipToGroupEnd();
                            return;
                        }
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventStart(-1231384433, $changed2, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2938)");
                        }
                        Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(10));
                        CustomerOrderHistoryItem customerOrderHistoryItem2 = CustomerOrderHistoryItem.this;
                        long j3 = j;
                        long j4 = j2;
                        State<PosSettings> state2 = state;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                        MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer2, ((6 >> 3) & 14) | ((6 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, m816padding3ABfNKs);
                        Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
                        int i2 = ((((6 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function0 = constructor;
                            $composer2.createNode(function0);
                        } else {
                            function0 = constructor;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
                        int i3 = (i2 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                        ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
                        int i4 = ((6 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, 501916618, "C2939@194953L1407,2956@196421L29,2957@196511L353,2962@196925L482,2968@197468L385:BillingScreen.kt#7ez3px");
                        Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                        Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
                        ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                        MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, Alignment.INSTANCE.getTop(), $composer2, ((54 >> 3) & 14) | ((54 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        CompositionLocalMap currentCompositionLocalMap2 = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default2);
                        Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                        int i5 = ((((54 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function02 = constructor2;
                            $composer2.createNode(function02);
                        } else {
                            function02 = constructor2;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                        int i6 = (i5 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                        RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
                        int i7 = ((54 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -1062678733, "C2943@195299L485,2949@195849L449:BillingScreen.kt#7ez3px");
                        String billNo = customerOrderHistoryItem2.getBillNo();
                        if (billNo != null || (billNo = customerOrderHistoryItem2.getOrderReference()) != null) {
                            composer = $composer2;
                        } else {
                            composer = $composer2;
                            billNo = "#" + customerOrderHistoryItem2.getId();
                        }
                        TextKt.m3069TextNvy7gAk("Bill: " + billNo, null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer, 1597824, 0, 262058);
                        String status = customerOrderHistoryItem2.getStatus();
                        if (status == null) {
                            status = "COMPLETED";
                        }
                        TextKt.m3069TextNvy7gAk(status, null, ColorKt.getSaSGreenLight(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer, 1597440, 0, 262058);
                        ComposerKt.sourceInformationMarkerEnd(composer);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        $composer2.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(4)), $composer2, 6);
                        String createdAt = customerOrderHistoryItem2.getCreatedAt();
                        if (createdAt == null || (str = StringsKt.take(createdAt, 10)) == null) {
                            str = "N/A";
                        }
                        TextKt.m3069TextNvy7gAk("Date: " + str, null, j3, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 24576, 0, 262122);
                        BillingScreen$lambda$20 = BillingScreenKt.BillingScreen$lambda$20(state2);
                        String currency = BillingScreen$lambda$20.getCurrency();
                        Double totalPrice = customerOrderHistoryItem2.getTotalPrice();
                        double doubleValue = totalPrice != null ? totalPrice.doubleValue() : 0.0d;
                        BillingScreen$lambda$202 = BillingScreenKt.BillingScreen$lambda$20(state2);
                        formatPrice = BillingScreenKt.formatPrice(doubleValue, BillingScreen$lambda$202);
                        TextKt.m3069TextNvy7gAk("Total: " + currency + " " + formatPrice, null, ColorKt.getSaSGreen(), null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 1597440, 0, 262058);
                        String paymentMethod = customerOrderHistoryItem2.getPaymentMethod();
                        if (paymentMethod == null) {
                            paymentMethod = "CASH";
                        }
                        String paymentStatus = customerOrderHistoryItem2.getPaymentStatus();
                        if (paymentStatus == null) {
                            paymentStatus = "PAID";
                        }
                        TextKt.m3069TextNvy7gAk("Paid via: " + paymentMethod + " (" + paymentStatus + ")", null, j4, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 24576, 0, 262122);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        $composer2.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventEnd();
                        }
                    }
                }, $composer, 54), $composer, 196614, 10);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$9$0(final List $txs, final long $InputDark, final long $CardBorderDark, final long $TextPrimary, final long $TextSecondary, final State $posSettings$delegate, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((CustomerTransactionHistoryItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(CustomerTransactionHistoryItem customerTransactionHistoryItem) {
                return null;
            }
        };
        LazyColumn.items($txs.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($txs.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$20$0$0$9$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if (!$composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    $composer.skipToGroupEnd();
                    return;
                }
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                }
                int i = $dirty & 14;
                final CustomerTransactionHistoryItem customerTransactionHistoryItem = (CustomerTransactionHistoryItem) $txs.get(it);
                $composer.startReplaceGroup(1199024527);
                ComposerKt.sourceInformation($composer, "CN(tx)*2994@199314L38,2997@199600L3518,2993@199230L3888:BillingScreen.kt#7ez3px");
                CardColors m2141cardColorsro_MJ88 = CardDefaults.INSTANCE.m2141cardColorsro_MJ88($InputDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14);
                BorderStroke m288BorderStrokecXLIe8U = BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark);
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                final long j = $TextPrimary;
                final long j2 = $TextSecondary;
                final State state = $posSettings$delegate;
                CardKt.Card(fillMaxWidth$default, null, m2141cardColorsro_MJ88, null, m288BorderStrokecXLIe8U, ComposableLambdaKt.rememberComposableLambda(658609334, true, new Function3<ColumnScope, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$19$1$1$7$1$1$1
                    @Override // kotlin.jvm.functions.Function3
                    public /* bridge */ /* synthetic */ Unit invoke(ColumnScope columnScope, Composer composer, Integer num) {
                        invoke(columnScope, composer, num.intValue());
                        return Unit.INSTANCE;
                    }

                    public final void invoke(ColumnScope Card, Composer $composer2, int $changed2) {
                        Function0 function0;
                        Function0 function02;
                        String str;
                        String str2;
                        Composer composer;
                        Integer points;
                        PosSettings BillingScreen$lambda$20;
                        PosSettings BillingScreen$lambda$202;
                        String formatPrice;
                        Intrinsics.checkNotNullParameter(Card, "$this$Card");
                        ComposerKt.sourceInformation($composer2, "C2998@199658L3406:BillingScreen.kt#7ez3px");
                        if (!$composer2.shouldExecute(($changed2 & 17) != 16, $changed2 & 1)) {
                            $composer2.skipToGroupEnd();
                            return;
                        }
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventStart(658609334, $changed2, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:2998)");
                        }
                        Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(10));
                        CustomerTransactionHistoryItem customerTransactionHistoryItem2 = CustomerTransactionHistoryItem.this;
                        long j3 = j;
                        long j4 = j2;
                        State<PosSettings> state2 = state;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                        MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer2, ((6 >> 3) & 14) | ((6 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, m816padding3ABfNKs);
                        Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
                        int i2 = ((((6 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function0 = constructor;
                            $composer2.createNode(function0);
                        } else {
                            function0 = constructor;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
                        int i3 = (i2 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer2, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                        ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
                        int i4 = ((6 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -1624224052, "C2999@199763L1288,3015@201112L29,3032@202667L339:BillingScreen.kt#7ez3px");
                        Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                        Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
                        ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                        MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, Alignment.INSTANCE.getTop(), $composer2, ((54 >> 3) & 14) | ((54 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        CompositionLocalMap currentCompositionLocalMap2 = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default2);
                        Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                        int i5 = ((((54 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function02 = constructor2;
                            $composer2.createNode(function02);
                        } else {
                            function02 = constructor2;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                        int i6 = (i5 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                        RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
                        int i7 = ((54 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -400042941, "C3003@200109L463,3009@200637L352:BillingScreen.kt#7ez3px");
                        String type = customerTransactionHistoryItem2.getType();
                        if (type == null || (str = StringsKt.replace$default(type, "_", " ", false, 4, (Object) null)) == null) {
                            str = "TRANSACTION";
                        }
                        TextKt.m3069TextNvy7gAk(str, null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 1597824, 0, 262058);
                        String createdAt = customerTransactionHistoryItem2.getCreatedAt();
                        if (createdAt == null || (str2 = StringsKt.take(createdAt, 10)) == null) {
                            str2 = "";
                        }
                        TextKt.m3069TextNvy7gAk(str2, null, j4, null, TextUnitKt.getSp(10), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 24576, 0, 262122);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        $composer2.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(4)), $composer2, 6);
                        if (customerTransactionHistoryItem2.getAmount() == null || Intrinsics.areEqual(customerTransactionHistoryItem2.getAmount(), 0.0d)) {
                            composer = $composer2;
                            composer.startReplaceGroup(-1622205674);
                            composer.endReplaceGroup();
                        } else {
                            $composer2.startReplaceGroup(-1622772664);
                            ComposerKt.sourceInformation($composer2, "3017@201311L526");
                            BillingScreen$lambda$20 = BillingScreenKt.BillingScreen$lambda$20(state2);
                            String currency = BillingScreen$lambda$20.getCurrency();
                            double doubleValue = customerTransactionHistoryItem2.getAmount().doubleValue();
                            BillingScreen$lambda$202 = BillingScreenKt.BillingScreen$lambda$20(state2);
                            formatPrice = BillingScreenKt.formatPrice(doubleValue, BillingScreen$lambda$202);
                            TextKt.m3069TextNvy7gAk("Amount: " + currency + " " + formatPrice, null, customerTransactionHistoryItem2.getAmount().doubleValue() > 0.0d ? ColorKt.getSaSGreen() : ColorKt.getStatusDanger(), null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 1597440, 0, 262058);
                            composer = $composer2;
                            composer.endReplaceGroup();
                        }
                        if (customerTransactionHistoryItem2.getPoints() != null && ((points = customerTransactionHistoryItem2.getPoints()) == null || points.intValue() != 0)) {
                            composer.startReplaceGroup(-1622024231);
                            ComposerKt.sourceInformation(composer, "3025@202067L477");
                            TextKt.m3069TextNvy7gAk("Points: " + (customerTransactionHistoryItem2.getPoints().intValue() > 0 ? "+" : "") + customerTransactionHistoryItem2.getPoints(), null, ColorKt.getSaSGreenLight(), null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer, 1597440, 0, 262058);
                            composer.endReplaceGroup();
                        } else {
                            composer.startReplaceGroup(-1621504330);
                            composer.endReplaceGroup();
                        }
                        String reason = customerTransactionHistoryItem2.getReason();
                        if (reason == null) {
                            reason = "No reason provided";
                        }
                        Composer composer2 = composer;
                        TextKt.m3069TextNvy7gAk(reason, null, j3, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer2, 24576, 0, 262122);
                        ComposerKt.sourceInformationMarkerEnd(composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        $composer2.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventEnd();
                        }
                    }
                }, $composer, 54), $composer, 196614, 10);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$10$0(MutableState $showHistoryDialog$delegate) {
        BillingScreen$lambda$94($showHistoryDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$20$0$0$11(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3051@203698L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(709228370, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3051)");
            }
            TextKt.m3069TextNvy7gAk("Close", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$21$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$106($showPaymentDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22(long $CardDark, final long $CardBorderDark, final Map $billingItems, final MutableState $discountInput$delegate, final State $posSettings$delegate, final MutableState $orderType$delegate, final MutableState $serviceChargeInput$delegate, final MutableState $deliveryChargeInput$delegate, final MutableState $isComplimentaryOrder$delegate, final MutableState $advancePaidInput$delegate, final long $InputDark, final MutableState $paymentMethod$delegate, final BillingViewModel $billingViewModel, final MutableState $customerName$delegate, final MutableState $customerPhone$delegate, final MutableState $customerAddress$delegate, final MutableState $preOrderIdInput$delegate, final State $selectedTable$delegate, final MutableState $selectedWaiter$delegate, final UserProfile $user, final Context $context, final MutableState $showPaymentDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3062@204087L37,3065@204291L8925,3060@203976L9240:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(612197641, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3060)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(59756759, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda242
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$22$0;
                    BillingScreen$lambda$140$0$22$0 = BillingScreenKt.BillingScreen$lambda$140$0$22$0($billingItems, $discountInput$delegate, $posSettings$delegate, $orderType$delegate, $serviceChargeInput$delegate, $deliveryChargeInput$delegate, $isComplimentaryOrder$delegate, $advancePaidInput$delegate, $InputDark, $CardBorderDark, $paymentMethod$delegate, $billingViewModel, $customerName$delegate, $customerPhone$delegate, $customerAddress$delegate, $preOrderIdInput$delegate, $selectedTable$delegate, $selectedWaiter$delegate, $user, $context, $showPaymentDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$22$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:120:0x0b10  */
    /* JADX WARN: Removed duplicated region for block: B:123:0x0b1c  */
    /* JADX WARN: Removed duplicated region for block: B:126:0x0bc8  */
    /* JADX WARN: Removed duplicated region for block: B:134:0x0de0  */
    /* JADX WARN: Removed duplicated region for block: B:139:0x0bda  */
    /* JADX WARN: Removed duplicated region for block: B:140:0x0b20  */
    /* JADX WARN: Removed duplicated region for block: B:141:0x076c  */
    /* JADX WARN: Removed duplicated region for block: B:142:0x03cd  */
    /* JADX WARN: Removed duplicated region for block: B:143:0x02a7  */
    /* JADX WARN: Removed duplicated region for block: B:144:0x0294  */
    /* JADX WARN: Removed duplicated region for block: B:145:0x0281  */
    /* JADX WARN: Removed duplicated region for block: B:146:0x026e  */
    /* JADX WARN: Removed duplicated region for block: B:148:0x0244  */
    /* JADX WARN: Removed duplicated region for block: B:33:0x023f  */
    /* JADX WARN: Removed duplicated region for block: B:41:0x0269  */
    /* JADX WARN: Removed duplicated region for block: B:44:0x027e  */
    /* JADX WARN: Removed duplicated region for block: B:47:0x028f  */
    /* JADX WARN: Removed duplicated region for block: B:50:0x02a2  */
    /* JADX WARN: Removed duplicated region for block: B:53:0x03bb  */
    /* JADX WARN: Removed duplicated region for block: B:56:0x03c7  */
    /* JADX WARN: Removed duplicated region for block: B:60:0x0472  */
    /* JADX WARN: Removed duplicated region for block: B:83:0x06a2 A[EDGE_INSN: B:83:0x06a2->B:84:0x06a2 BREAK  A[LOOP:1: B:58:0x0468->B:77:0x05cd], SYNTHETIC] */
    /* JADX WARN: Removed duplicated region for block: B:86:0x075a  */
    /* JADX WARN: Removed duplicated region for block: B:89:0x0766  */
    /* JADX WARN: Removed duplicated region for block: B:93:0x080d  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$22$0(java.util.Map r160, androidx.compose.runtime.MutableState r161, androidx.compose.runtime.State r162, final androidx.compose.runtime.MutableState r163, androidx.compose.runtime.MutableState r164, androidx.compose.runtime.MutableState r165, androidx.compose.runtime.MutableState r166, androidx.compose.runtime.MutableState r167, long r168, long r170, final androidx.compose.runtime.MutableState r172, final com.example.sasloopmanager.BillingViewModel r173, final androidx.compose.runtime.MutableState r174, final androidx.compose.runtime.MutableState r175, final androidx.compose.runtime.MutableState r176, final androidx.compose.runtime.MutableState r177, final androidx.compose.runtime.State r178, final androidx.compose.runtime.MutableState r179, final com.example.sasloopmanager.data.UserProfile r180, final android.content.Context r181, final androidx.compose.runtime.MutableState r182, final long r183, androidx.compose.foundation.layout.ColumnScope r185, androidx.compose.runtime.Composer r186, int r187) {
        /*
            Method dump skipped, instructions count: 3562
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$22$0(java.util.Map, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, long, long, androidx.compose.runtime.MutableState, com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.MutableState, androidx.compose.runtime.State, androidx.compose.runtime.MutableState, com.example.sasloopmanager.data.UserProfile, android.content.Context, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$1$0$0$0(String $method, MutableState $paymentMethod$delegate) {
        $paymentMethod$delegate.setValue($method);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$2$0$0$0(String $method, MutableState $paymentMethod$delegate) {
        $paymentMethod$delegate.setValue($method);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$0$0(MutableState $showPaymentDialog$delegate) {
        BillingScreen$lambda$106($showPaymentDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3172@210711L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2043946411, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3172)");
            }
            TextKt.m3069TextNvy7gAk("Cancel", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$2$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, UserProfile $user, MutableState $showPaymentDialog$delegate, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $customerAddress$delegate, final MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate, State $selectedTable$delegate, MutableState $selectedWaiter$delegate, final Context $context) {
        String str;
        String str2;
        String str3;
        BillingScreen$lambda$106($showPaymentDialog$delegate, false);
        String BillingScreen$lambda$39 = BillingScreen$lambda$39($customerName$delegate);
        String BillingScreen$lambda$42 = BillingScreen$lambda$42($customerPhone$delegate);
        String BillingScreen$lambda$45 = BillingScreen$lambda$45($customerAddress$delegate);
        String BillingScreen$lambda$51 = BillingScreen$lambda$51($paymentMethod$delegate);
        String BillingScreen$lambda$48 = BillingScreen$lambda$48($orderType$delegate);
        String BillingScreen$lambda$63 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$63($preOrderIdInput$delegate) : null;
        Double valueOf = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null;
        Double valueOf2 = Intrinsics.areEqual(BillingScreen$lambda$48($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null;
        TableItem BillingScreen$lambda$15 = BillingScreen$lambda$15($selectedTable$delegate);
        if (BillingScreen$lambda$15 == null || (str = BillingScreen$lambda$15.getTableName()) == null) {
            str = "Direct";
        }
        String str4 = str;
        String BillingScreen$lambda$78 = BillingScreen$lambda$78($selectedWaiter$delegate);
        if ($user == null || (str3 = $user.getName()) == null) {
            String username = $user != null ? $user.getUsername() : null;
            if (username != null) {
                str2 = username;
                $billingViewModel.settleOrder(BillingScreen$lambda$39, BillingScreen$lambda$42, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0, (65536 & r59) != 0 ? "SETTLE" : "SETTLE", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda48
                    @Override // kotlin.jvm.functions.Function1
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
                        BillingScreen$lambda$140$0$22$0$0$3$2$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$22$0$0$3$2$0$0($context, $paymentMethod$delegate, ((Boolean) obj).booleanValue());
                        return BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
                    }
                });
                return Unit.INSTANCE;
            }
            str3 = "admin";
        }
        str2 = str3;
        $billingViewModel.settleOrder(BillingScreen$lambda$39, BillingScreen$lambda$42, BillingScreen$lambda$45, BillingScreen$lambda$51, BillingScreen$lambda$48, $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, (r59 & 1024) != 0 ? null : BillingScreen$lambda$63, (r59 & 2048) != 0 ? null : valueOf, (r59 & 4096) != 0 ? null : valueOf2, (r59 & 8192) != 0 ? "Direct" : str4, (r59 & 16384) != 0 ? null : BillingScreen$lambda$78, (32768 & r59) != 0, (65536 & r59) != 0 ? "SETTLE" : "SETTLE", (131072 & r59) != 0 ? "admin" : str2, (262144 & r59) != 0 ? "" : null, (r59 & 524288) != 0 ? 0.0d : 0.0d, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda48
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
                BillingScreen$lambda$140$0$22$0$0$3$2$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$22$0$0$3$2$0$0($context, $paymentMethod$delegate, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$140$0$22$0$0$3$2$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$22$0$0$3$2$0$0(Context $context, MutableState $paymentMethod$delegate, boolean success) {
        if (success) {
            Toast.makeText($context, "Settle via " + BillingScreen$lambda$51($paymentMethod$delegate) + " Successful", 0).show();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$23$0(MutableState $selectedItemForModifiers$delegate) {
        $selectedItemForModifiers$delegate.setValue(null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$24$0(BillingViewModel $billingViewModel, MenuItem $itemForModifiers, MutableState $selectedItemForModifiers$delegate, List selected, String note) {
        Intrinsics.checkNotNullParameter(selected, "selected");
        Intrinsics.checkNotNullParameter(note, "note");
        $billingViewModel.addCustomItemToCart($itemForModifiers, selected, note);
        $selectedItemForModifiers$delegate.setValue(null);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$25$0(MutableState $showOldKotDialog$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$26(long $CardDark, final long $CardBorderDark, final State $oldKotItems$delegate, final long $InputDark, final long $TextSecondary, final long $TextPrimary, final MutableState $showOldKotDialog$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3231@214106L37,3234@214310L4199,3229@213995L4514:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-255729721, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3229)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-808170603, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda49
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$26$0;
                    BillingScreen$lambda$140$0$26$0 = BillingScreenKt.BillingScreen$lambda$140$0$26$0(State.this, $InputDark, $CardBorderDark, $TextSecondary, $TextPrimary, $showOldKotDialog$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$26$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$26$0(final State $oldKotItems$delegate, final long $InputDark, final long $CardBorderDark, final long $TextSecondary, final long $TextPrimary, final MutableState $showOldKotDialog$delegate, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Composer composer;
        int i;
        Composer composer2;
        Composer composer3;
        Composer composer4;
        Modifier modifier;
        Function0 function02;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C3235@214336L4151:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-808170603, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3235)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(16));
            Alignment.Horizontal centerHorizontally = Alignment.INSTANCE.getCenterHorizontally();
            Arrangement.Vertical m686spacedBy0680j_4 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(m686spacedBy0680j_4, centerHorizontally, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i2 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i3 = (i2 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i4 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1595160731, "C3240@214622L255,3293@218224L40,3292@218138L28,3295@218363L98,3291@218088L373:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk("Old KOT Items", null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(16), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597830, 0, 262058);
            if (BillingScreen$lambda$5($oldKotItems$delegate).isEmpty()) {
                $composer.startReplaceGroup(-1594956783);
                ComposerKt.sourceInformation($composer, "3248@214968L370");
                Modifier m848height3ABfNKs = SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(100));
                Alignment center = Alignment.INSTANCE.getCenter();
                ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, m848height3ABfNKs);
                Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                int i5 = ((((54 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                if (!($composer.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                $composer.startReusableNode();
                if ($composer.getInserting()) {
                    function02 = constructor2;
                    $composer.createNode(function02);
                } else {
                    function02 = constructor2;
                    $composer.useNode();
                }
                Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer);
                Updater.m4372setimpl(m4364constructorimpl2, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                int i6 = (i5 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
                int i7 = ((54 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, 1482676289, "C3252@215204L100:BillingScreen.kt#7ez3px");
                TextKt.m3069TextNvy7gAk("No saved KOT items found for this table", null, $TextSecondary, null, 0L, FontStyle.m7434boximpl(FontStyle.INSTANCE.m7443getItalic_LCdwA()), null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262106);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
                composer3 = $composer;
                i = 54;
                composer2 = $composer;
                composer4 = $composer;
            } else {
                $composer.startReplaceGroup(-1594450553);
                ComposerKt.sourceInformation($composer, "3258@215634L2394,3255@215408L2620");
                Modifier m850heightInVpY3zN4$default = SizeKt.m850heightInVpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), 0.0f, Dp.m7902constructorimpl(240), 1, null);
                Arrangement.HorizontalOrVertical m686spacedBy0680j_42 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
                ComposerKt.sourceInformationMarkerStart($composer, -189973191, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = $composer.changed($oldKotItems$delegate) | $composer.changed($InputDark) | $composer.changed($CardBorderDark) | $composer.changed($TextSecondary) | $composer.changed($TextPrimary);
                Object rememberedValue = $composer.rememberedValue();
                if (!changed) {
                    composer = $composer;
                    if (rememberedValue != Composer.INSTANCE.getEmpty()) {
                        i = 54;
                        composer2 = $composer;
                        composer3 = composer;
                        composer4 = $composer;
                        modifier = m850heightInVpY3zN4$default;
                        ComposerKt.sourceInformationMarkerEnd(composer3);
                        LazyDslKt.LazyColumn(modifier, null, null, false, m686spacedBy0680j_42, null, null, false, null, (Function1) rememberedValue, composer3, 24582, 494);
                        composer3.endReplaceGroup();
                    }
                } else {
                    composer = $composer;
                }
                i = 54;
                composer2 = $composer;
                composer3 = composer;
                composer4 = $composer;
                modifier = m850heightInVpY3zN4$default;
                rememberedValue = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda88
                    @Override // kotlin.jvm.functions.Function1
                    public final Object invoke(Object obj) {
                        Unit BillingScreen$lambda$140$0$26$0$0$1$0;
                        BillingScreen$lambda$140$0$26$0$0$1$0 = BillingScreenKt.BillingScreen$lambda$140$0$26$0$0$1$0(State.this, $InputDark, $CardBorderDark, $TextPrimary, $TextSecondary, (LazyListScope) obj);
                        return BillingScreen$lambda$140$0$26$0$0$1$0;
                    }
                };
                $composer.updateRememberedValue(rememberedValue);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                LazyDslKt.LazyColumn(modifier, null, null, false, m686spacedBy0680j_42, null, null, false, null, (Function1) rememberedValue, composer3, 24582, 494);
                composer3.endReplaceGroup();
            }
            Composer composer5 = composer3;
            ButtonColors m2121buttonColorsro_MJ88 = ButtonDefaults.INSTANCE.m2121buttonColorsro_MJ88($InputDark, 0L, 0L, 0L, composer5, ButtonDefaults.$stable << 12, 14);
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            ComposerKt.sourceInformationMarkerStart(composer5, -189895429, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = composer5.rememberedValue();
            if (rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda89
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$26$0$0$2$0;
                        BillingScreen$lambda$140$0$26$0$0$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$26$0$0$2$0(MutableState.this);
                        return BillingScreen$lambda$140$0$26$0$0$2$0;
                    }
                };
                composer5.updateRememberedValue(obj);
                rememberedValue2 = obj;
            }
            ComposerKt.sourceInformationMarkerEnd(composer5);
            ButtonKt.Button((Function0) rememberedValue2, fillMaxWidth$default, false, null, m2121buttonColorsro_MJ88, null, null, null, null, ComposableLambdaKt.rememberComposableLambda(-592662673, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda90
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj2, Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$26$0$0$3;
                    BillingScreen$lambda$140$0$26$0$0$3 = BillingScreenKt.BillingScreen$lambda$140$0$26$0$0$3($TextPrimary, (RowScope) obj2, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$26$0$0$3;
                }
            }, composer5, i), composer5, 805306422, 492);
            ComposerKt.sourceInformationMarkerEnd(composer5);
            ComposerKt.sourceInformationMarkerEnd(composer4);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd(composer2);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$26$0$0$1$0(State $oldKotItems$delegate, final long $InputDark, final long $CardBorderDark, final long $TextPrimary, final long $TextSecondary, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final List list = CollectionsKt.toList(BillingScreen$lambda$5($oldKotItems$delegate).entrySet());
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$26$0$0$1$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((Map.Entry<? extends MenuItem, ? extends Integer>) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(Map.Entry<? extends MenuItem, ? extends Integer> entry) {
                return null;
            }
        };
        LazyColumn.items(list.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$26$0$0$1$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(list.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$26$0$0$1$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                ComposerKt.sourceInformation($composer, "CN(it)178@8834L22:LazyDsl.kt#428nma");
                int $dirty = $changed;
                if (($changed & 6) == 0) {
                    $dirty |= $composer.changed($this$items) ? 4 : 2;
                }
                if (($changed & 48) == 0) {
                    $dirty |= $composer.changed(it) ? 32 : 16;
                }
                if (!$composer.shouldExecute(($dirty & 147) != 146, $dirty & 1)) {
                    $composer.skipToGroupEnd();
                    return;
                }
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventStart(802480018, $dirty, -1, "androidx.compose.foundation.lazy.items.<anonymous> (LazyDsl.kt:178)");
                }
                int i = $dirty & 14;
                Map.Entry entry = (Map.Entry) list.get(it);
                $composer.startReplaceGroup(-1469548620);
                ComposerKt.sourceInformation($composer, "CN(entry)*3263@215954L38,3266@216204L1752,3262@215882L2074:BillingScreen.kt#7ez3px");
                final MenuItem menuItem = (MenuItem) entry.getKey();
                final int intValue = ((Number) entry.getValue()).intValue();
                CardColors m2141cardColorsro_MJ88 = CardDefaults.INSTANCE.m2141cardColorsro_MJ88($InputDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14);
                BorderStroke m288BorderStrokecXLIe8U = BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark);
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                final long j = $TextPrimary;
                final long j2 = $TextSecondary;
                CardKt.Card(fillMaxWidth$default, null, m2141cardColorsro_MJ88, null, m288BorderStrokecXLIe8U, ComposableLambdaKt.rememberComposableLambda(-1258197496, true, new Function3<ColumnScope, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$7$1$25$1$1$2$1$1$1
                    @Override // kotlin.jvm.functions.Function3
                    public /* bridge */ /* synthetic */ Unit invoke(ColumnScope columnScope, Composer composer, Integer num) {
                        invoke(columnScope, composer, num.intValue());
                        return Unit.INSTANCE;
                    }

                    public final void invoke(ColumnScope Card, Composer $composer2, int $changed2) {
                        Function0 function0;
                        Function0 function02;
                        Composer composer;
                        String displayName;
                        boolean z;
                        int i2;
                        Composer composer2;
                        Composer composer3;
                        Composer composer4;
                        Intrinsics.checkNotNullParameter(Card, "$this$Card");
                        ComposerKt.sourceInformation($composer2, "C3267@216250L1664:BillingScreen.kt#7ez3px");
                        if (!$composer2.shouldExecute(($changed2 & 17) != 16, $changed2 & 1)) {
                            $composer2.skipToGroupEnd();
                            return;
                        }
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventStart(-1258197496, $changed2, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3267)");
                        }
                        Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(10));
                        MenuItem menuItem2 = MenuItem.this;
                        long j3 = j;
                        int i3 = intValue;
                        long j4 = j2;
                        ComposerKt.sourceInformationMarkerStart($composer2, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                        Arrangement.Vertical top = Arrangement.INSTANCE.getTop();
                        Alignment.Horizontal start = Alignment.INSTANCE.getStart();
                        MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(top, start, $composer2, ((6 >> 3) & 14) | ((6 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
                        Alignment.Horizontal horizontal = start;
                        CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
                        Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, m816padding3ABfNKs);
                        Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
                        int i4 = ((((6 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer2.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        $composer2.startReusableNode();
                        if ($composer2.getInserting()) {
                            function0 = constructor;
                            $composer2.createNode(function0);
                        } else {
                            function0 = constructor;
                            $composer2.useNode();
                        }
                        Composer m4364constructorimpl = Updater.m4364constructorimpl($composer2);
                        Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
                        int i5 = (i4 >> 6) & 14;
                        Composer composer5 = $composer2;
                        ComposerKt.sourceInformationMarkerStart(composer5, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                        ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
                        int i6 = ((6 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer5, 926340060, "C3268@216343L657:BillingScreen.kt#7ez3px");
                        CompositionLocalMap compositionLocalMap = currentCompositionLocalMap;
                        Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                        Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
                        ComposerKt.sourceInformationMarkerStart(composer5, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                        MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, Alignment.INSTANCE.getTop(), composer5, ((54 >> 3) & 14) | ((54 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart(composer5, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer5, 0));
                        CompositionLocalMap currentCompositionLocalMap2 = composer5.getCurrentCompositionLocalMap();
                        Modifier materializeModifier2 = ComposedModifierKt.materializeModifier(composer5, fillMaxWidth$default2);
                        Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                        int i7 = ((((54 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer5, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!(composer5.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        composer5.startReusableNode();
                        if (composer5.getInserting()) {
                            function02 = constructor2;
                            composer5.createNode(function02);
                        } else {
                            function02 = constructor2;
                            composer5.useNode();
                        }
                        Composer m4364constructorimpl2 = Updater.m4364constructorimpl(composer5);
                        Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                        int i8 = (i7 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart(composer5, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                        RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
                        int i9 = ((54 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer5, 1529651328, "C3272@216641L168,3273@216862L88:BillingScreen.kt#7ez3px");
                        if (menuItem2.getPriceLabel() != null) {
                            composer = composer5;
                            displayName = menuItem2.getDisplayName() + " (" + menuItem2.getPriceLabel() + ")";
                        } else {
                            composer = composer5;
                            displayName = menuItem2.getDisplayName();
                        }
                        TextKt.m3069TextNvy7gAk(displayName, null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer, 1597824, 0, 262058);
                        TextKt.m3069TextNvy7gAk("Qty: " + i3, null, ColorKt.getSaSGreenLight(), null, TextUnitKt.getSp(12), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer, 1597440, 0, 262058);
                        ComposerKt.sourceInformationMarkerEnd(composer);
                        ComposerKt.sourceInformationMarkerEnd(composer5);
                        composer5.endNode();
                        ComposerKt.sourceInformationMarkerEnd(composer5);
                        ComposerKt.sourceInformationMarkerEnd(composer5);
                        ComposerKt.sourceInformationMarkerEnd(composer5);
                        List<SelectedModifier> selectedModifiers = menuItem2.getSelectedModifiers();
                        if (selectedModifiers == null || selectedModifiers.isEmpty()) {
                            z = true;
                            i2 = 11;
                            composer2 = composer5;
                            composer2.startReplaceGroup(927432592);
                            composer2.endReplaceGroup();
                        } else {
                            composer5.startReplaceGroup(927050114);
                            ComposerKt.sourceInformation(composer5, "3276@217148L29,*3278@217326L62");
                            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(4)), composer5, 6);
                            Iterable selectedModifiers2 = menuItem2.getSelectedModifiers();
                            Iterator it2 = selectedModifiers2.iterator();
                            while (it2.hasNext()) {
                                Composer composer6 = composer5;
                                TextKt.m3069TextNvy7gAk("+ " + ((SelectedModifier) it2.next()).getName(), null, j4, null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer6, 24576, 0, 262122);
                                horizontal = horizontal;
                                compositionLocalMap = compositionLocalMap;
                                composer5 = composer6;
                                top = top;
                                selectedModifiers2 = selectedModifiers2;
                            }
                            z = true;
                            i2 = 11;
                            composer2 = composer5;
                            composer2.endReplaceGroup();
                        }
                        String kitchenNote = menuItem2.getKitchenNote();
                        if ((kitchenNote == null || StringsKt.isBlank(kitchenNote)) ? z : false) {
                            composer3 = $composer2;
                            composer4 = $composer2;
                            composer2.startReplaceGroup(927805584);
                            composer2.endReplaceGroup();
                        } else {
                            composer2.startReplaceGroup(927528816);
                            ComposerKt.sourceInformation(composer2, "3282@217634L29,3283@217716L102");
                            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(4)), composer2, 6);
                            Composer composer7 = composer2;
                            composer3 = $composer2;
                            composer4 = $composer2;
                            TextKt.m3069TextNvy7gAk("Note: " + menuItem2.getKitchenNote(), null, j3, null, TextUnitKt.getSp(i2), FontStyle.m7434boximpl(FontStyle.INSTANCE.m7443getItalic_LCdwA()), null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer7, 24576, 0, 262090);
                            composer2 = composer7;
                            composer2.endReplaceGroup();
                        }
                        ComposerKt.sourceInformationMarkerEnd(composer2);
                        ComposerKt.sourceInformationMarkerEnd(composer5);
                        composer3.endNode();
                        ComposerKt.sourceInformationMarkerEnd(composer3);
                        ComposerKt.sourceInformationMarkerEnd(composer4);
                        ComposerKt.sourceInformationMarkerEnd($composer2);
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventEnd();
                        }
                    }
                }, $composer, 54), $composer, 196614, 10);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$26$0$0$2$0(MutableState $showOldKotDialog$delegate) {
        BillingScreen$lambda$109($showOldKotDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$26$0$0$3(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3296@218397L34:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-592662673, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3296)");
            }
            TextKt.m3069TextNvy7gAk("Close", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$28$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29(final long $CardDark, long $CardBorderDark, final double $finalTotal, final long $InputDark, final Map $billingItems, final State $posSettings$delegate, final long $TextSecondary, final Context $context, final MutableState $showSplitBillDialog$delegate, final long $TextPrimary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3328@219980L37,3331@220184L12469,3326@219869L12784:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-701510385, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3326)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88($CardDark, 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), $CardBorderDark), ComposableLambdaKt.rememberComposableLambda(-647308543, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda100
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$29$0;
                    BillingScreen$lambda$140$0$29$0 = BillingScreenKt.BillingScreen$lambda$140$0$29$0($finalTotal, $InputDark, $billingItems, $CardDark, $posSettings$delegate, $TextSecondary, $context, $showSplitBillDialog$delegate, $TextPrimary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$29$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:44:0x05c5, code lost:
    
        if (r14 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L57;
     */
    /* JADX WARN: Code restructure failed: missing block: B:72:0x114d, code lost:
    
        if (r6 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L165;
     */
    /* JADX WARN: Removed duplicated region for block: B:118:0x0c46  */
    /* JADX WARN: Removed duplicated region for block: B:140:0x0ce0  */
    /* JADX WARN: Removed duplicated region for block: B:161:0x0e06  */
    /* JADX WARN: Removed duplicated region for block: B:164:0x0e12  */
    /* JADX WARN: Removed duplicated region for block: B:166:0x0e18  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit BillingScreen$lambda$140$0$29$0(double r155, final long r157, java.util.Map r159, final long r160, androidx.compose.runtime.State r162, final long r163, final android.content.Context r165, androidx.compose.runtime.MutableState r166, final long r167, androidx.compose.foundation.layout.ColumnScope r169, androidx.compose.runtime.Composer r170, int r171) {
        /*
            Method dump skipped, instructions count: 4552
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen$lambda$140$0$29$0(double, long, java.util.Map, long, androidx.compose.runtime.State, long, android.content.Context, androidx.compose.runtime.MutableState, long, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    private static final int BillingScreen$lambda$140$0$29$0$0$1(MutableState<Integer> mutableState) {
        return mutableState.getValue().intValue();
    }

    private static final void BillingScreen$lambda$140$0$29$0$0$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3(final MutableState $splitTab$delegate, final long $TextSecondary, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3354@221388L16,3355@221449L123,3352@221275L331,3359@221752L16,3360@221813L123,3357@221639L331,3364@222116L16,3365@222177L120,3362@222003L328:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(299390991, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3352)");
            }
            boolean z = BillingScreen$lambda$140$0$29$0$0$1($splitTab$delegate) == 0;
            ComposerKt.sourceInformationMarkerStart($composer, -48061761, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer.rememberedValue();
            if (rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda53
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$29$0$0$3$0$0;
                        BillingScreen$lambda$140$0$29$0$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$140$0$29$0$0$3$0$0(MutableState.this);
                        return BillingScreen$lambda$140$0$29$0$0$3$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(z, (Function0) rememberedValue, null, false, ComposableLambdaKt.rememberComposableLambda(-1371987851, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda54
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$140$0$29$0$0$3$1;
                    BillingScreen$lambda$140$0$29$0$0$3$1 = BillingScreenKt.BillingScreen$lambda$140$0$29$0$0$3$1($TextSecondary, $splitTab$delegate, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$140$0$29$0$0$3$1;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24624, 492);
            boolean z2 = BillingScreen$lambda$140$0$29$0$0$1($splitTab$delegate) == 1;
            ComposerKt.sourceInformationMarkerStart($composer, -48050113, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer.rememberedValue();
            if (rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda55
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$29$0$0$3$2$0;
                        BillingScreen$lambda$140$0$29$0$0$3$2$0 = BillingScreenKt.BillingScreen$lambda$140$0$29$0$0$3$2$0(MutableState.this);
                        return BillingScreen$lambda$140$0$29$0$0$3$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(z2, (Function0) rememberedValue2, null, false, ComposableLambdaKt.rememberComposableLambda(1621439020, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda56
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$140$0$29$0$0$3$3;
                    BillingScreen$lambda$140$0$29$0$0$3$3 = BillingScreenKt.BillingScreen$lambda$140$0$29$0$0$3$3($TextSecondary, $splitTab$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$140$0$29$0$0$3$3;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24624, 492);
            boolean z3 = BillingScreen$lambda$140$0$29$0$0$1($splitTab$delegate) == 2;
            ComposerKt.sourceInformationMarkerStart($composer, -48038465, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue3 = $composer.rememberedValue();
            if (rememberedValue3 == Composer.INSTANCE.getEmpty()) {
                Object obj3 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda57
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$140$0$29$0$0$3$4$0;
                        BillingScreen$lambda$140$0$29$0$0$3$4$0 = BillingScreenKt.BillingScreen$lambda$140$0$29$0$0$3$4$0(MutableState.this);
                        return BillingScreen$lambda$140$0$29$0$0$3$4$0;
                    }
                };
                $composer.updateRememberedValue(obj3);
                rememberedValue3 = obj3;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(z3, (Function0) rememberedValue3, null, false, ComposableLambdaKt.rememberComposableLambda(1980853357, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda58
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj4, Object obj5) {
                    Unit BillingScreen$lambda$140$0$29$0$0$3$5;
                    BillingScreen$lambda$140$0$29$0$0$3$5 = BillingScreenKt.BillingScreen$lambda$140$0$29$0$0$3$5($TextSecondary, $splitTab$delegate, (Composer) obj4, ((Integer) obj5).intValue());
                    return BillingScreen$lambda$140$0$29$0$0$3$5;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24624, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3$0$0(MutableState $splitTab$delegate) {
        BillingScreen$lambda$140$0$29$0$0$2($splitTab$delegate, 0);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3$1(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3355@221451L119:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1371987851, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3355)");
            }
            TextKt.m3069TextNvy7gAk("Portion", null, BillingScreen$lambda$140$0$29$0$0$1($splitTab$delegate) == 0 ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3$2$0(MutableState $splitTab$delegate) {
        BillingScreen$lambda$140$0$29$0$0$2($splitTab$delegate, 1);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3$3(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3360@221815L119:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1621439020, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3360)");
            }
            TextKt.m3069TextNvy7gAk("Percent", null, BillingScreen$lambda$140$0$29$0$0$1($splitTab$delegate) == 1 ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3$4$0(MutableState $splitTab$delegate) {
        BillingScreen$lambda$140$0$29$0$0$2($splitTab$delegate, 2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$3$5(long $TextSecondary, MutableState $splitTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3365@222179L116:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1980853357, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3365)");
            }
            TextKt.m3069TextNvy7gAk("Item", null, BillingScreen$lambda$140$0$29$0$0$1($splitTab$delegate) == 2 ? ColorKt.getSaSGreen() : $TextSecondary, null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final int BillingScreen$lambda$140$0$29$0$0$5(MutableState<Integer> mutableState) {
        return mutableState.getValue().intValue();
    }

    private static final void BillingScreen$lambda$140$0$29$0$0$6(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$7$0$0$0$0(int $num, MutableState $portions$delegate) {
        BillingScreen$lambda$140$0$29$0$0$6($portions$delegate, $num);
        return Unit.INSTANCE;
    }

    private static final String BillingScreen$lambda$140$0$29$0$0$9(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$11$0$0(MutableState $percentInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $percentInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$13$0(final List $itemsList, final SnapshotStateMap $itemAssignments, final long $InputDark, final long $CardDark, LazyListScope LazyColumn) {
        Intrinsics.checkNotNullParameter(LazyColumn, "$this$LazyColumn");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$29$0$0$13$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((Map.Entry<? extends MenuItem, ? extends Integer>) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(Map.Entry<? extends MenuItem, ? extends Integer> entry) {
                return null;
            }
        };
        LazyColumn.items($itemsList.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$29$0$0$13$0$$inlined$items$default$3
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($itemsList.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$29$0$0$13$0$$inlined$items$default$4
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            /* JADX WARN: Removed duplicated region for block: B:56:0x04d5  */
            /* JADX WARN: Removed duplicated region for block: B:59:0x04e1  */
            /* JADX WARN: Removed duplicated region for block: B:62:0x05b6  */
            /* JADX WARN: Removed duplicated region for block: B:70:0x06a1  */
            /* JADX WARN: Removed duplicated region for block: B:73:0x06ad  */
            /* JADX WARN: Removed duplicated region for block: B:76:0x07ae  */
            /* JADX WARN: Removed duplicated region for block: B:79:? A[RETURN, SYNTHETIC] */
            /* JADX WARN: Removed duplicated region for block: B:80:0x06b3  */
            /* JADX WARN: Removed duplicated region for block: B:82:0x05bb  */
            /* JADX WARN: Removed duplicated region for block: B:83:0x04e7  */
            /*
                Code decompiled incorrectly, please refer to instructions dump.
                To view partially-correct add '--show-bad-code' argument
            */
            public final void invoke(androidx.compose.foundation.lazy.LazyItemScope r127, int r128, androidx.compose.runtime.Composer r129, int r130) {
                /*
                    Method dump skipped, instructions count: 1976
                    To view this dump add '--comments-level debug' option
                */
                throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$140$0$29$0$0$13$0$$inlined$items$default$4.invoke(androidx.compose.foundation.lazy.LazyItemScope, int, androidx.compose.runtime.Composer, int):void");
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$17$0$0(MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, false);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$17$1(long $TextPrimary, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C3497@231884L35:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(334274763, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3497)");
            }
            TextKt.m3069TextNvy7gAk("Cancel", null, $TextPrimary, null, 0L, null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 6, 0, 262138);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$140$0$29$0$0$17$2$0(Context $context, MutableState $showSplitBillDialog$delegate) {
        BillingScreen$lambda$112($showSplitBillDialog$delegate, false);
        Toast.makeText($context, "Bill split successfully", 0).show();
        return Unit.INSTANCE;
    }

    /* renamed from: FlowCard-FHprtrg, reason: not valid java name */
    private static final void m8475FlowCardFHprtrg(Modifier modifier, final String title, final String subtext, final ImageVector icon, final long iconColor, final Function0<Unit> function0, Composer $composer, final int $changed, final int i) {
        Modifier modifier2;
        String str;
        String str2;
        ImageVector imageVector;
        Function0<Unit> function02;
        int $dirty;
        final Modifier modifier3;
        Modifier.Companion modifier4;
        Composer $composer2 = $composer.startRestartGroup(-589557774);
        ComposerKt.sourceInformation($composer2, "C(FlowCard)N(modifier,title,subtext,icon,iconColor:c#ui.graphics.Color,onClick)3528@232994L11,3529@233050L11,3530@233108L11,3537@233320L38,3539@233415L890,3532@233142L1163:BillingScreen.kt#7ez3px");
        int $dirty2 = $changed;
        int i2 = i & 1;
        if (i2 != 0) {
            $dirty2 |= 6;
            modifier2 = modifier;
        } else if (($changed & 6) == 0) {
            modifier2 = modifier;
            $dirty2 |= $composer2.changed(modifier2) ? 4 : 2;
        } else {
            modifier2 = modifier;
        }
        if (($changed & 48) == 0) {
            str = title;
            $dirty2 |= $composer2.changed(str) ? 32 : 16;
        } else {
            str = title;
        }
        if (($changed & 384) == 0) {
            str2 = subtext;
            $dirty2 |= $composer2.changed(str2) ? 256 : 128;
        } else {
            str2 = subtext;
        }
        if (($changed & 3072) == 0) {
            imageVector = icon;
            $dirty2 |= $composer2.changed(imageVector) ? 2048 : 1024;
        } else {
            imageVector = icon;
        }
        if (($changed & 24576) == 0) {
            $dirty2 |= $composer2.changed(iconColor) ? 16384 : 8192;
        }
        if ((196608 & $changed) == 0) {
            function02 = function0;
            $dirty2 |= $composer2.changedInstance(function02) ? 131072 : 65536;
        } else {
            function02 = function0;
        }
        if (!$composer2.shouldExecute((74899 & $dirty2) != 74898, $dirty2 & 1)) {
            $dirty = $dirty2;
            $composer2.skipToGroupEnd();
            modifier3 = modifier2;
        } else {
            if (i2 != 0) {
                modifier4 = Modifier.INSTANCE;
            } else {
                modifier4 = modifier2;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-589557774, $dirty2, -1, "com.example.sasloopmanager.FlowCard (BillingScreen.kt:3527)");
            }
            long cardColor = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getSurface();
            long borderColor = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOutline();
            final long textSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant();
            Modifier m297clickableoSLSa3U$default = ClickableKt.m297clickableoSLSa3U$default(SizeKt.m848height3ABfNKs(modifier4, Dp.m7902constructorimpl(130)), false, null, null, null, function02, 15, null);
            RoundedCornerShape m1124RoundedCornerShape0680j_4 = RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16));
            $dirty = $dirty2;
            CardColors m2141cardColorsro_MJ88 = CardDefaults.INSTANCE.m2141cardColorsro_MJ88(cardColor, 0L, 0L, 0L, $composer2, CardDefaults.$stable << 12, 14);
            $composer2 = $composer2;
            final String str3 = str;
            final String str4 = str2;
            final ImageVector imageVector2 = imageVector;
            CardKt.Card(m297clickableoSLSa3U$default, m1124RoundedCornerShape0680j_4, m2141cardColorsro_MJ88, null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), borderColor), ComposableLambdaKt.rememberComposableLambda(1976965988, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda15
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.FlowCard_FHprtrg$lambda$0(iconColor, imageVector2, str3, str4, textSecondary, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer2, 54), $composer2, ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            modifier3 = modifier4;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda16
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.FlowCard_FHprtrg$lambda$1(Modifier.this, title, subtext, icon, iconColor, function0, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit FlowCard_FHprtrg$lambda$0(long $iconColor, ImageVector $icon, String $title, String $subtext, long $textSecondary, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        long m5092copywmQWz5c;
        Function0 function02;
        Function0 function03;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C3540@233425L874:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1976965988, $changed, -1, "com.example.sasloopmanager.FlowCard.<anonymous> (BillingScreen.kt:3540)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxSize$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(14));
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.INSTANCE.getStart(), $composer, ((54 >> 3) & 14) | ((54 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((54 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i3 = ((54 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1259130532, "C3546@233612L356,3555@233981L308:BillingScreen.kt#7ez3px");
            Modifier clip = ClipKt.clip(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(36)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(10)));
            m5092copywmQWz5c = Color.m5092copywmQWz5c($iconColor, (r12 & 1) != 0 ? Color.m5096getAlphaimpl($iconColor) : 0.15f, (r12 & 2) != 0 ? Color.m5100getRedimpl($iconColor) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl($iconColor) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl($iconColor) : 0.0f);
            Modifier m262backgroundbw27NRU$default = BackgroundKt.m262backgroundbw27NRU$default(clip, m5092copywmQWz5c, null, 2, null);
            Alignment center = Alignment.INSTANCE.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, m262backgroundbw27NRU$default);
            Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
            int i4 = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function02 = constructor2;
                $composer.createNode(function02);
            } else {
                function02 = constructor2;
                $composer.useNode();
            }
            Composer m4364constructorimpl2 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl2, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
            int i6 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -611467776, "C3553@233887L67:BillingScreen.kt#7ez3px");
            IconKt.m2517Iconww6aTOc($icon, (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(20)), $iconColor, $composer, 432, 0);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
            int i7 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function03 = constructor3;
                $composer.createNode(function03);
            } else {
                function03 = constructor3;
                $composer.useNode();
            }
            Composer m4364constructorimpl3 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl3, columnMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance2 = ColumnScopeInstance.INSTANCE;
            int i9 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1420085254, "C3556@234040L11,3556@234006L104,3557@234127L29,3558@234173L102:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk($title, null, MaterialTheme.INSTANCE.getColorScheme($composer, MaterialTheme.$stable).getOnSurface(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(3)), $composer, 6);
            TextKt.m3069TextNvy7gAk($subtext, null, $textSecondary, null, TextUnitKt.getSp(10), null, null, null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 1, 0, null, null, $composer, 24576, 24960, 241642);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    public static final void TableCard(final TableItem table, final String status, final Double orderTotal, final int orderItemsCount, final Function0<Unit> function0, final boolean showBillDetails, final boolean showOrderStatus, final String currency, final int decimalPlaces, final boolean showKOTNoOnTable, final boolean displayTimeOnTable, final Order activeOrder, final Long activeTimestamp, boolean isSelected, Composer $composer, final int $changed, final int $changed1, final int i) {
        TableItem tableItem;
        int i2;
        Composer $composer2;
        final boolean isSelected2;
        long tableStatusAvailable;
        String str;
        long borderColor;
        final long badgeBgColor;
        MutableState ticks$delegate;
        String displayStatus;
        BorderStroke borderStroke;
        Composer $composer3 = $composer.startRestartGroup(1790144612);
        ComposerKt.sourceInformation($composer3, "C(TableCard)N(table,status,orderTotal,orderItemsCount,onClick,showBillDetails,showOrderStatus,currency,decimalPlaces,showKOTNoOnTable,displayTimeOnTable,activeOrder,activeTimestamp,isSelected)3585@234951L30,3631@236375L38,3633@236451L4617,3625@236169L4899:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int $dirty1 = $changed1;
        if (($changed & 6) == 0) {
            tableItem = table;
            $dirty |= $composer3.changed(tableItem) ? 4 : 2;
        } else {
            tableItem = table;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer3.changed(status) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer3.changed(orderTotal) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            i2 = orderItemsCount;
            $dirty |= $composer3.changed(i2) ? 2048 : 1024;
        } else {
            i2 = orderItemsCount;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer3.changedInstance(function0) ? 16384 : 8192;
        }
        if (($changed & ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE) == 0) {
            $dirty |= $composer3.changed(showBillDetails) ? 131072 : 65536;
        }
        if (($changed & 1572864) == 0) {
            $dirty |= $composer3.changed(showOrderStatus) ? 1048576 : 524288;
        }
        if (($changed & 12582912) == 0) {
            $dirty |= $composer3.changed(currency) ? 8388608 : 4194304;
        }
        if (($changed & 100663296) == 0) {
            $dirty |= $composer3.changed(decimalPlaces) ? AccessibilityEventCompat.TYPE_VIEW_TARGETED_BY_SCROLL : 33554432;
        }
        if (($changed & 805306368) == 0) {
            $dirty |= $composer3.changed(showKOTNoOnTable) ? 536870912 : 268435456;
        }
        if (($changed1 & 6) == 0) {
            $dirty1 |= $composer3.changed(displayTimeOnTable) ? 4 : 2;
        }
        if (($changed1 & 48) == 0) {
            $dirty1 |= ($changed1 & 64) == 0 ? $composer3.changed(activeOrder) : $composer3.changedInstance(activeOrder) ? 32 : 16;
        }
        if (($changed1 & 384) == 0) {
            $dirty1 |= $composer3.changed(activeTimestamp) ? 256 : 128;
        }
        int i3 = i & 8192;
        if (i3 != 0) {
            $dirty1 |= 3072;
        } else if (($changed1 & 3072) == 0) {
            $dirty1 |= $composer3.changed(isSelected) ? 2048 : 1024;
        }
        if ($composer3.shouldExecute((($dirty & 306783379) == 306783378 && ($dirty1 & 1171) == 1170) ? false : true, $dirty & 1)) {
            boolean isSelected3 = i3 != 0 ? false : isSelected;
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1790144612, $dirty, $dirty1, "com.example.sasloopmanager.TableCard (BillingScreen.kt:3581)");
            }
            String statusUpper = status.toUpperCase(Locale.ROOT);
            Intrinsics.checkNotNullExpressionValue(statusUpper, "toUpperCase(...)");
            final boolean isOccupied = (Intrinsics.areEqual(statusUpper, "AVAILABLE") || Intrinsics.areEqual(statusUpper, "VACANT")) ? false : true;
            boolean isSelected4 = isSelected3;
            ComposerKt.sourceInformationMarkerStart($composer3, -1952895678, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer3.rememberedValue();
            int $dirty12 = $dirty1;
            if (rememberedValue == Composer.INSTANCE.getEmpty()) {
                rememberedValue = SnapshotStateKt__SnapshotStateKt.mutableStateOf$default(0, null, 2, null);
                $composer3.updateRememberedValue(rememberedValue);
            }
            MutableState ticks$delegate2 = (MutableState) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer3);
            if (!displayTimeOnTable || activeTimestamp == null || activeTimestamp.longValue() <= 0) {
                $composer3.startReplaceGroup(-409963906);
                $composer3.endReplaceGroup();
            } else {
                $composer3.startReplaceGroup(-410111900);
                ComposerKt.sourceInformation($composer3, "3587@235102L106,3587@235070L138");
                ComposerKt.sourceInformationMarkerStart($composer3, -1952890770, "CC(remember):BillingScreen.kt#9igjgp");
                Object rememberedValue2 = $composer3.rememberedValue();
                if (rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                    Object obj = (Function2) new BillingScreenKt$TableCard$1$1(ticks$delegate2, null);
                    $composer3.updateRememberedValue(obj);
                    rememberedValue2 = obj;
                }
                ComposerKt.sourceInformationMarkerEnd($composer3);
                EffectsKt.LaunchedEffect(activeTimestamp, (Function2<? super CoroutineScope, ? super Continuation<? super Unit>, ? extends Object>) rememberedValue2, $composer3, ($dirty12 >> 6) & 14);
                $composer3.endReplaceGroup();
            }
            switch (statusUpper.hashCode()) {
                case -1226282194:
                    if (statusUpper.equals("DRAFT_PRINTED")) {
                        tableStatusAvailable = ColorKt.getTableStatusDraftPrinted();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 78673511:
                    if (statusUpper.equals("SAVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusSaved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 403264492:
                    if (statusUpper.equals("PRINTED")) {
                        tableStatusAvailable = ColorKt.getTableStatusPrinted();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 432241448:
                    if (statusUpper.equals("RESERVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusReserved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 1301183189:
                    if (statusUpper.equals("ITEMS_IN_KOT")) {
                        tableStatusAvailable = ColorKt.getTableStatusItemsInKot();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 1953666095:
                    if (statusUpper.equals("BILL_SAVED")) {
                        tableStatusAvailable = ColorKt.getTableStatusBillSaved();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                case 2016941524:
                    if (statusUpper.equals("ORDERING")) {
                        tableStatusAvailable = ColorKt.getTableStatusOrdering();
                        break;
                    }
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
                default:
                    tableStatusAvailable = ColorKt.getTableStatusAvailable();
                    break;
            }
            long statusColor = tableStatusAvailable;
            switch (statusUpper.hashCode()) {
                case -1226282194:
                    if (statusUpper.equals("DRAFT_PRINTED")) {
                        str = "DRAFT PRINTED";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 1301183189:
                    if (statusUpper.equals("ITEMS_IN_KOT")) {
                        str = "ITEMS IN KOT";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 1953666095:
                    if (statusUpper.equals("BILL_SAVED")) {
                        str = "BILL SAVED";
                        break;
                    }
                    str = statusUpper;
                    break;
                case 2052692649:
                    if (statusUpper.equals("AVAILABLE")) {
                        str = "VACANT";
                        break;
                    }
                    str = statusUpper;
                    break;
                default:
                    str = statusUpper;
                    break;
            }
            String displayStatus2 = str;
            borderColor = Color.m5092copywmQWz5c(r19, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r19) : 0.15f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r19) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r19) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(Color.INSTANCE.m5131getWhite0d7_KjU()) : 0.0f);
            badgeBgColor = Color.m5092copywmQWz5c(r19, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r19) : 0.2f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r19) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r19) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(Color.INSTANCE.m5131getWhite0d7_KjU()) : 0.0f);
            final long badgeTextColor = Color.INSTANCE.m5131getWhite0d7_KjU();
            if (isSelected4) {
                ticks$delegate = ticks$delegate2;
                displayStatus = displayStatus2;
                borderStroke = BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(3), androidx.compose.ui.graphics.ColorKt.Color(4294286859L));
            } else {
                ticks$delegate = ticks$delegate2;
                displayStatus = displayStatus2;
                borderStroke = BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), borderColor);
            }
            final String displayStatus3 = displayStatus;
            final int i4 = i2;
            final MutableState ticks$delegate3 = ticks$delegate;
            final TableItem tableItem2 = tableItem;
            CardKt.Card(ClickableKt.m297clickableoSLSa3U$default(SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(105)), false, null, null, null, function0, 15, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88(statusColor, 0L, 0L, 0L, $composer3, CardDefaults.$stable << 12, 14), null, borderStroke, ComposableLambdaKt.rememberComposableLambda(526908246, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda240
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj2, Object obj3, Object obj4) {
                    return BillingScreenKt.TableCard$lambda$4(isOccupied, orderTotal, showBillDetails, tableItem2, displayTimeOnTable, activeTimestamp, showKOTNoOnTable, activeOrder, showOrderStatus, badgeBgColor, ticks$delegate3, displayStatus3, badgeTextColor, i4, currency, decimalPlaces, (ColumnScope) obj2, (Composer) obj3, ((Integer) obj4).intValue());
                }
            }, $composer3, 54), $composer3, ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE, 8);
            $composer2 = $composer3;
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            isSelected2 = isSelected4;
        } else {
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
            isSelected2 = isSelected;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda241
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj2, Object obj3) {
                    return BillingScreenKt.TableCard$lambda$5(TableItem.this, status, orderTotal, orderItemsCount, function0, showBillDetails, showOrderStatus, currency, decimalPlaces, showKOTNoOnTable, displayTimeOnTable, activeOrder, activeTimestamp, isSelected2, $changed, $changed1, i, (Composer) obj2, ((Integer) obj3).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final int TableCard$lambda$1(MutableState<Integer> mutableState) {
        return mutableState.getValue().intValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void TableCard$lambda$2(MutableState<Integer> mutableState, int i) {
        mutableState.setValue(Integer.valueOf(i));
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* JADX WARN: Removed duplicated region for block: B:45:0x0554  */
    /* JADX WARN: Removed duplicated region for block: B:76:0x0575  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit TableCard$lambda$4(boolean r163, java.lang.Double r164, boolean r165, com.example.sasloopmanager.data.TableItem r166, boolean r167, java.lang.Long r168, boolean r169, final com.example.sasloopmanager.data.Order r170, boolean r171, long r172, androidx.compose.runtime.MutableState r174, final java.lang.String r175, final long r176, int r178, java.lang.String r179, int r180, androidx.compose.foundation.layout.ColumnScope r181, androidx.compose.runtime.Composer r182, int r183) {
        /*
            Method dump skipped, instructions count: 2427
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.TableCard$lambda$4(boolean, java.lang.Double, boolean, com.example.sasloopmanager.data.TableItem, boolean, java.lang.Long, boolean, com.example.sasloopmanager.data.Order, boolean, long, androidx.compose.runtime.MutableState, java.lang.String, long, int, java.lang.String, int, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit TableCard$lambda$4$0$0$0$0$1(String $elapsedStr, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3668@238064L370:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-527706672, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3668)");
            }
            TextKt.m3069TextNvy7gAk($elapsedStr, PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(5), Dp.m7902constructorimpl(2)), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit TableCard$lambda$4$0$0$0$0$2(Order $activeOrder, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3683@238802L384:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1243044025, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3683)");
            }
            TextKt.m3069TextNvy7gAk("KOT #" + $activeOrder.getId(), PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(5), Dp.m7902constructorimpl(2)), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit TableCard$lambda$4$0$0$0$0$3(String $displayStatus, long $badgeTextColor, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3698@239512L376:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1696422856, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3698)");
            }
            TextKt.m3069TextNvy7gAk($displayStatus, PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(6), Dp.m7902constructorimpl(3)), $badgeTextColor, null, TextUnitKt.getSp(8), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Removed duplicated region for block: B:110:0x027e  */
    /* JADX WARN: Removed duplicated region for block: B:117:0x02bb  */
    /* JADX WARN: Removed duplicated region for block: B:119:0x02c6 A[ADDED_TO_REGION] */
    /* JADX WARN: Removed duplicated region for block: B:122:0x02cd  */
    /* JADX WARN: Removed duplicated region for block: B:131:0x02ea  */
    /* JADX WARN: Removed duplicated region for block: B:137:0x03d3  */
    /* JADX WARN: Removed duplicated region for block: B:146:0x0331  */
    /* JADX WARN: Removed duplicated region for block: B:150:0x02c0  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final void MenuItemCard(final com.example.sasloopmanager.data.MenuItem r47, final int r48, final int r49, final kotlin.jvm.functions.Function0<kotlin.Unit> r50, final kotlin.jvm.functions.Function0<kotlin.Unit> r51, final boolean r52, final java.lang.String r53, final boolean r54, final int r55, boolean r56, boolean r57, boolean r58, androidx.compose.runtime.Composer r59, final int r60, final int r61, final int r62) {
        /*
            Method dump skipped, instructions count: 1044
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.MenuItemCard(com.example.sasloopmanager.data.MenuItem, int, int, kotlin.jvm.functions.Function0, kotlin.jvm.functions.Function0, boolean, java.lang.String, boolean, int, boolean, boolean, boolean, androidx.compose.runtime.Composer, int, int, int):void");
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    /* JADX WARN: Code restructure failed: missing block: B:117:0x0e62, code lost:
    
        if (r0 == null) goto L128;
     */
    /* JADX WARN: Code restructure failed: missing block: B:179:0x15b7, code lost:
    
        if (r11 == androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L215;
     */
    /* JADX WARN: Removed duplicated region for block: B:128:0x0f8c  */
    /* JADX WARN: Removed duplicated region for block: B:138:0x10ca  */
    /* JADX WARN: Removed duplicated region for block: B:141:0x10d6  */
    /* JADX WARN: Removed duplicated region for block: B:144:0x11d2  */
    /* JADX WARN: Removed duplicated region for block: B:166:0x1410  */
    /* JADX WARN: Removed duplicated region for block: B:169:0x141c  */
    /* JADX WARN: Removed duplicated region for block: B:172:0x149b  */
    /* JADX WARN: Removed duplicated region for block: B:178:0x15af  */
    /* JADX WARN: Removed duplicated region for block: B:183:0x1652  */
    /* JADX WARN: Removed duplicated region for block: B:186:0x165e  */
    /* JADX WARN: Removed duplicated region for block: B:189:0x1664  */
    /* JADX WARN: Removed duplicated region for block: B:190:0x15bb  */
    /* JADX WARN: Removed duplicated region for block: B:192:0x14e6  */
    /* JADX WARN: Removed duplicated region for block: B:193:0x1422  */
    /* JADX WARN: Removed duplicated region for block: B:200:0x173f  */
    /* JADX WARN: Removed duplicated region for block: B:205:0x10da  */
    /* JADX WARN: Removed duplicated region for block: B:212:0x102a  */
    /* JADX WARN: Removed duplicated region for block: B:54:0x083d  */
    /* JADX WARN: Removed duplicated region for block: B:63:0x09a5  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    public static final kotlin.Unit MenuItemCard$lambda$1(boolean r144, float r145, boolean r146, final java.lang.String r147, com.example.sasloopmanager.data.MenuItem r148, long r149, int r151, int r152, boolean r153, final kotlin.jvm.functions.Function0 r154, java.lang.String r155, int r156, boolean r157, boolean r158, float r159, long r160, long r162, final boolean r164, long r165, float r167, long r168, final kotlin.jvm.functions.Function0 r170, long r171, float r173, androidx.compose.foundation.layout.ColumnScope r174, androidx.compose.runtime.Composer r175, int r176) {
        /*
            Method dump skipped, instructions count: 6178
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.MenuItemCard$lambda$1(boolean, float, boolean, java.lang.String, com.example.sasloopmanager.data.MenuItem, long, int, int, boolean, kotlin.jvm.functions.Function0, java.lang.String, int, boolean, boolean, float, long, long, boolean, long, float, long, kotlin.jvm.functions.Function0, long, float, androidx.compose.foundation.layout.ColumnScope, androidx.compose.runtime.Composer, int):kotlin.Unit");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$0$1(int $totalQty, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C3866@246529L348:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1106993098, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3866)");
            }
            Alignment center = Alignment.INSTANCE.getCenter();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(center, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, modifier);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((48 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
            int i3 = ((48 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 1791748588, "C3867@246600L251:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk(String.valueOf($totalQty), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$0$2(int $resolvedPrepTime, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C3887@247543L337:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(988842453, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:3887)");
            }
            TextKt.m3069TextNvy7gAk("🕒 " + $resolvedPrepTime + "m", PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(4), Dp.m7902constructorimpl(2)), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(8), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597872, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$0$4$0(Function0 $onAdd) {
        $onAdd.invoke();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$1$3$0$0$0(Function0 $onRemove) {
        $onRemove.invoke();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$1$3$0$2$0(Function0 $onAdd) {
        $onAdd.invoke();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$1$1$3$1(boolean $isCompact, RowScope Button, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(Button, "$this$Button");
        ComposerKt.sourceInformation($composer, "C4087@256756L105:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1865522651, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:4087)");
            }
            TextKt.m3069TextNvy7gAk("Add", null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp($isCompact ? 9 : 11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1573254, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String formatPrice(double price, PosSettings posSettings) {
        StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
        String format = String.format(Locale.US, "%." + posSettings.getDecimalPlaces() + "f", Arrays.copyOf(new Object[]{Double.valueOf(price)}, 1));
        Intrinsics.checkNotNullExpressionValue(format, "format(...)");
        return format;
    }

    /* renamed from: ReceiptRow-6jM-SoI, reason: not valid java name */
    private static final void m8476ReceiptRow6jMSoI(final String label, final String value, boolean isBold, long color, long fontSize, Composer $composer, final int $changed, final int i) {
        String str;
        boolean z;
        long color2;
        long j;
        final boolean isBold2;
        final long textPrimary;
        final long color3;
        boolean isBold3;
        long fontSize2;
        int i2;
        long j2;
        Function0 function0;
        Composer $composer2 = $composer.startRestartGroup(1071795232);
        ComposerKt.sourceInformation($composer2, "C(ReceiptRow)N(label,value,isBold,color:c#ui.graphics.Color,fontSize:c#ui.unit.TextUnit)4108@257396L11,4109@257456L11,4114@257615L590:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            str = label;
            $dirty |= $composer2.changed(str) ? 4 : 2;
        } else {
            str = label;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(value) ? 32 : 16;
        }
        int i3 = i & 4;
        if (i3 != 0) {
            $dirty |= 384;
            z = isBold;
        } else if (($changed & 384) == 0) {
            z = isBold;
            $dirty |= $composer2.changed(z) ? 256 : 128;
        } else {
            z = isBold;
        }
        int i4 = i & 8;
        if (i4 != 0) {
            $dirty |= 3072;
            color2 = color;
        } else if (($changed & 3072) == 0) {
            color2 = color;
            $dirty |= $composer2.changed(color2) ? 2048 : 1024;
        } else {
            color2 = color;
        }
        int i5 = i & 16;
        if (i5 != 0) {
            $dirty |= 24576;
            j = fontSize;
        } else if (($changed & 24576) == 0) {
            j = fontSize;
            $dirty |= $composer2.changed(j) ? 16384 : 8192;
        } else {
            j = fontSize;
        }
        if ($composer2.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            if (i3 != 0) {
                isBold3 = false;
            } else {
                isBold3 = z;
            }
            if (i4 != 0) {
                color2 = Color.INSTANCE.m5130getUnspecified0d7_KjU();
            }
            if (i5 == 0) {
                fontSize2 = j;
                i2 = 1071795232;
            } else {
                fontSize2 = TextUnitKt.getSp(12);
                i2 = 1071795232;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(i2, $dirty, -1, "com.example.sasloopmanager.ReceiptRow (BillingScreen.kt:4107)");
            }
            long textPrimary2 = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurface();
            long textSecondary = MaterialTheme.INSTANCE.getColorScheme($composer2, MaterialTheme.$stable).getOnSurfaceVariant();
            if (Color.m5095equalsimpl0(color2, Color.INSTANCE.m5130getUnspecified0d7_KjU())) {
                j2 = isBold3 ? textPrimary2 : textSecondary;
            } else {
                j2 = color2;
            }
            long displayColor = j2;
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            int $dirty2 = $dirty;
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i6 = ((((438 << 3) & 112) << 6) & 896) | 6;
            boolean isBold4 = isBold3;
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                function0 = constructor;
                $composer2.createNode(function0);
            } else {
                function0 = constructor;
                $composer2.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer2);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i7 = (i6 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i8 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer2, -1745756439, "C4119@257793L214,4125@258016L183:BillingScreen.kt#7ez3px");
            long j3 = isBold4 ? textPrimary2 : textSecondary;
            FontWeight.Companion companion = FontWeight.INSTANCE;
            TextKt.m3069TextNvy7gAk(str, null, j3, null, fontSize2, null, isBold4 ? companion.getBold() : companion.getNormal(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, ($dirty2 & 14) | ($dirty2 & 57344), 0, 262058);
            FontWeight.Companion companion2 = FontWeight.INSTANCE;
            TextKt.m3069TextNvy7gAk(value, null, displayColor, null, fontSize2, null, isBold4 ? companion2.getBlack() : companion2.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, (($dirty2 >> 3) & 14) | ($dirty2 & 57344), 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            textPrimary = color2;
            color3 = fontSize2;
            isBold2 = isBold4;
        } else {
            $composer2.skipToGroupEnd();
            isBold2 = z;
            textPrimary = color2;
            color3 = j;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda68
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ReceiptRow_6jM_SoI$lambda$1(label, value, isBold2, textPrimary, color3, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    private static final void ItemCustomizationDialog(final MenuItem item, final List<OptionGroup> list, final Function0<Unit> function0, final Function2<? super List<SelectedModifier>, ? super String, Unit> function2, final String currency, Composer $composer, final int $changed) {
        Function2<? super List<SelectedModifier>, ? super String, Unit> function22;
        final String str;
        Context context;
        Object mutableStateOf$default;
        Object mutableStateOf$default2;
        Composer $composer2 = $composer.startRestartGroup(-1745650077);
        ComposerKt.sourceInformation($composer2, "C(ItemCustomizationDialog)N(item,optionGroups,onDismiss,onAdd,currency)4142@258449L58,4143@258531L31,4144@258594L7,4146@258630L98,4150@258771L9065,4150@258734L9102:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= ($changed & 8) == 0 ? $composer2.changed(item) : $composer2.changedInstance(item) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changedInstance(list) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            $dirty |= $composer2.changedInstance(function0) ? 256 : 128;
        }
        if (($changed & 3072) == 0) {
            function22 = function2;
            $dirty |= $composer2.changedInstance(function22) ? 2048 : 1024;
        } else {
            function22 = function2;
        }
        if (($changed & 24576) == 0) {
            str = currency;
            $dirty |= $composer2.changed(str) ? 16384 : 8192;
        } else {
            str = currency;
        }
        int $dirty2 = $dirty;
        if (!$composer2.shouldExecute(($dirty2 & 9363) != 9362, $dirty2 & 1)) {
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1745650077, $dirty2, -1, "com.example.sasloopmanager.ItemCustomizationDialog (BillingScreen.kt:4141)");
            }
            ComposerKt.sourceInformationMarkerStart($composer2, 1762495837, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue = $composer2.rememberedValue();
            if (rememberedValue == Composer.INSTANCE.getEmpty()) {
                mutableStateOf$default2 = SnapshotStateKt__SnapshotStateKt.mutableStateOf$default(CollectionsKt.emptyList(), null, 2, null);
                $composer2.updateRememberedValue(mutableStateOf$default2);
                rememberedValue = mutableStateOf$default2;
            }
            final MutableState selectedModifiers$delegate = (MutableState) rememberedValue;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerStart($composer2, 1762498434, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = $composer2.rememberedValue();
            if (rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                mutableStateOf$default = SnapshotStateKt__SnapshotStateKt.mutableStateOf$default("", null, 2, null);
                $composer2.updateRememberedValue(mutableStateOf$default);
                rememberedValue2 = mutableStateOf$default;
            }
            final MutableState kitchenNote$delegate = (MutableState) rememberedValue2;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ProvidableCompositionLocal<Context> localContext = AndroidCompositionLocals_androidKt.getLocalContext();
            ComposerKt.sourceInformationMarkerStart($composer2, 2023513938, "CC(<get-current>):CompositionLocal.kt#9igjgp");
            Object consume = $composer2.consume(localContext);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            Context context2 = (Context) consume;
            int id = item.getId();
            ComposerKt.sourceInformationMarkerStart($composer2, 1762501669, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer2.changed(id) | $composer2.changed(list);
            int i = 0;
            Object rememberedValue3 = $composer2.rememberedValue();
            if (changed || rememberedValue3 == Composer.INSTANCE.getEmpty()) {
                context = context2;
                Collection arrayList = new ArrayList();
                for (Object obj : list) {
                    boolean z = changed;
                    Integer itemId = ((OptionGroup) obj).getItemId();
                    int i2 = i;
                    if (itemId != null && itemId.intValue() == item.getId()) {
                        arrayList.add(obj);
                    }
                    changed = z;
                    i = i2;
                }
                Object obj2 = (List) arrayList;
                $composer2.updateRememberedValue(obj2);
                rememberedValue3 = obj2;
            } else {
                context = context2;
            }
            final List itemOptionGroups = (List) rememberedValue3;
            ComposerKt.sourceInformationMarkerEnd($composer2);
            final Function2<? super List<SelectedModifier>, ? super String, Unit> function23 = function22;
            final Context context3 = context;
            AndroidDialog_androidKt.Dialog(function0, null, ComposableLambdaKt.rememberComposableLambda(-1259160916, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda86
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj3, Object obj4) {
                    return BillingScreenKt.ItemCustomizationDialog$lambda$7(itemOptionGroups, context3, function23, function0, item, selectedModifiers$delegate, str, kitchenNote$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                }
            }, $composer2, 54), $composer2, (($dirty2 >> 6) & 14) | 384, 2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda87
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj3, Object obj4) {
                    return BillingScreenKt.ItemCustomizationDialog$lambda$8(MenuItem.this, list, function0, function2, currency, $changed, (Composer) obj3, ((Integer) obj4).intValue());
                }
            });
        }
    }

    private static final List<SelectedModifier> ItemCustomizationDialog$lambda$1(MutableState<List<SelectedModifier>> mutableState) {
        return mutableState.getValue();
    }

    private static final String ItemCustomizationDialog$lambda$4(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ItemCustomizationDialog$lambda$7(final List $itemOptionGroups, final Context $context, final Function2 $onAdd, final Function0 $onDismiss, final MenuItem $item, final MutableState $selectedModifiers$delegate, final String $currency, final MutableState $kitchenNote$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C4156@258965L37,4158@259070L8760,4151@258781L9049:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1259160916, $changed, -1, "com.example.sasloopmanager.ItemCustomizationDialog.<anonymous> (BillingScreen.kt:4151)");
            }
            CardKt.Card(PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(24)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88(ColorKt.getCardDark(), 0L, 0L, 0L, $composer, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), ColorKt.getCardBorderDark()), ComposableLambdaKt.rememberComposableLambda(613130362, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda30
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    Unit ItemCustomizationDialog$lambda$7$0;
                    ItemCustomizationDialog$lambda$7$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0($itemOptionGroups, $context, $onAdd, $onDismiss, $item, $selectedModifiers$delegate, $currency, $kitchenNote$delegate, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                    return ItemCustomizationDialog$lambda$7$0;
                }
            }, $composer, 54), $composer, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Multi-variable type inference failed */
    /* JADX WARN: Type inference failed for: r6v59 */
    /* JADX WARN: Type inference failed for: r6v64 */
    /* JADX WARN: Type inference failed for: r6v68 */
    /* JADX WARN: Type inference failed for: r6v85 */
    public static final Unit ItemCustomizationDialog$lambda$7$0(final List $itemOptionGroups, final Context $context, final Function2 $onAdd, Function0 $onDismiss, MenuItem $item, final MutableState $selectedModifiers$delegate, String $currency, MutableState $kitchenNote$delegate, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Function0 function03;
        Function0 function04;
        final MutableState mutableState;
        Function0 function05;
        Composer composer;
        ?? r6;
        final OptionItem optionItem;
        Object obj;
        Composer composer2;
        String str;
        Composer composer3;
        Alignment.Horizontal horizontal;
        Arrangement.Horizontal horizontal2;
        ColumnScope columnScope;
        String str2;
        Composer composer4;
        final double d;
        String str3;
        String str4;
        Composer composer5;
        Function0 function06;
        long textSecondary;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C4159@259084L8736:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(613130362, $changed, -1, "com.example.sasloopmanager.ItemCustomizationDialog.<anonymous>.<anonymous> (BillingScreen.kt:4159)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(20));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Arrangement.Vertical top = Arrangement.INSTANCE.getTop();
            Alignment.Horizontal start = Alignment.INSTANCE.getStart();
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(top, start, $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
            String str5 = "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh";
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((6 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            String str6 = "C89@4557L9:Column.kt#2w3rfo";
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = ((6 >> 6) & 112) | 6;
            ColumnScope columnScope2 = ColumnScopeInstance.INSTANCE;
            Composer composer6 = $composer;
            Alignment.Horizontal horizontal3 = start;
            Composer composer7 = $composer;
            ComposerKt.sourceInformationMarkerStart(composer7, 478686939, "C4165@259258L1009,4189@260285L41,4195@260525L21,4192@260387L6209,4296@266614L41,4299@266711L565,4311@267447L39,4298@266673L1133:BillingScreen.kt#7ez3px");
            Composer composer8 = $composer;
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            String str7 = "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo";
            ComposerKt.sourceInformationMarkerStart(composer7, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, composer7, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart(composer7, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer7, 0));
            CompositionLocalMap currentCompositionLocalMap2 = composer7.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier(composer7, fillMaxWidth$default);
            Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
            int i4 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart(composer7, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer7.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer7.startReusableNode();
            if (composer7.getInserting()) {
                function02 = constructor2;
                composer7.createNode(function02);
            } else {
                function02 = constructor2;
                composer7.useNode();
            }
            Composer m4364constructorimpl2 = Updater.m4364constructorimpl(composer7);
            Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart(composer7, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i6 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart(composer7, 675233554, "C4170@259496L577,4184@260094L155:BillingScreen.kt#7ez3px");
            ComposerKt.sourceInformationMarkerStart(composer7, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Modifier modifier = Modifier.INSTANCE;
            MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), composer7, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart(composer7, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer7, 0));
            CompositionLocalMap currentCompositionLocalMap3 = composer7.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier(composer7, modifier);
            Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
            int i7 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart(composer7, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer7.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer7.startReusableNode();
            if (composer7.getInserting()) {
                function03 = constructor3;
                composer7.createNode(function03);
            } else {
                function03 = constructor3;
                composer7.useNode();
            }
            Composer m4364constructorimpl3 = Updater.m4364constructorimpl(composer7);
            Updater.m4372setimpl(m4364constructorimpl3, columnMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart(composer7, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i9 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart(composer7, 1911269647, "C4171@259529L249,4177@259803L248:BillingScreen.kt#7ez3px");
            String upperCase = $item.getDisplayName().toUpperCase(Locale.ROOT);
            String str8 = "toUpperCase(...)";
            Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
            TextKt.m3069TextNvy7gAk(upperCase, null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(18), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer7, 1597824, 0, 262058);
            TextKt.m3069TextNvy7gAk("Customize your selection", null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer7, 1597446, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            composer7.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer7);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            IconButtonKt.IconButton($onDismiss, null, false, null, null, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$596709634$app(), composer7, 1572864, 62);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            composer7.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer7);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(16)), composer7, 6);
            Modifier verticalScroll$default = ScrollKt.verticalScroll$default(columnScope2.weight(Modifier.INSTANCE, 1.0f, false), ScrollKt.rememberScrollState(0, composer7, 0, 1), false, null, false, 14, null);
            ComposerKt.sourceInformationMarkerStart(composer7, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            ColumnScope columnScope3 = columnScope2;
            MeasurePolicy columnMeasurePolicy3 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), composer7, ((0 >> 3) & 14) | ((0 >> 3) & 112));
            Composer composer9 = composer7;
            ComposerKt.sourceInformationMarkerStart(composer9, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer9, 0));
            CompositionLocalMap currentCompositionLocalMap4 = composer9.getCurrentCompositionLocalMap();
            Modifier materializeModifier4 = ComposedModifierKt.materializeModifier(composer9, verticalScroll$default);
            Function0 constructor4 = ComposeUiNode.INSTANCE.getConstructor();
            String str9 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo";
            int i10 = ((((0 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart(composer9, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer9.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer9.startReusableNode();
            if (composer9.getInserting()) {
                function04 = constructor4;
                composer9.createNode(function04);
            } else {
                function04 = constructor4;
                composer9.useNode();
            }
            Composer m4364constructorimpl4 = Updater.m4364constructorimpl(composer9);
            Updater.m4372setimpl(m4364constructorimpl4, columnMeasurePolicy3, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl4, currentCompositionLocalMap4, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl4, Integer.valueOf(hashCode4), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl4, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl4, materializeModifier4, ComposeUiNode.INSTANCE.getSetModifier());
            int i11 = (i10 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart(composer9, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance2 = ColumnScopeInstance.INSTANCE;
            int i12 = ((0 >> 6) & 112) | 6;
            Composer composer10 = composer9;
            Composer composer11 = composer9;
            ComposerKt.sourceInformationMarkerStart(composer10, 40720591, "C4268@265241L287,4282@265986L408,4277@265653L20,4275@265549L1029:BillingScreen.kt#7ez3px");
            composer10.startReplaceGroup(694049396);
            ComposerKt.sourceInformation(composer10, "*4198@260645L374,4265@265156L41");
            Iterator it = $itemOptionGroups.iterator();
            while (true) {
                String str10 = "CC(remember):BillingScreen.kt#9igjgp";
                if (!it.hasNext()) {
                    break;
                }
                MeasurePolicy measurePolicy = columnMeasurePolicy3;
                final OptionGroup optionGroup = (OptionGroup) it.next();
                String str11 = str6;
                String upperCase2 = optionGroup.getName().toUpperCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(upperCase2, str8);
                String str12 = str8;
                Composer composer12 = composer10;
                Composer composer13 = composer9;
                TextKt.m3069TextNvy7gAk(upperCase2 + " (Min: " + optionGroup.getMinSelectable() + ", Max: " + optionGroup.getMaxSelectable() + ")", PaddingKt.m818paddingVpY3zN4$default(Modifier.INSTANCE, 0.0f, Dp.m7902constructorimpl(8), 1, null), ColorKt.getTextSecondary(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer12, 1597488, 0, 262056);
                List options = optionGroup.getOptions();
                if (options == null) {
                    options = CollectionsKt.emptyList();
                }
                composer12.startReplaceGroup(694065521);
                ComposerKt.sourceInformation(composer12, "*4208@261180L3925");
                for (List<OptionItem> list : CollectionsKt.chunked(options, 2)) {
                    Modifier modifier2 = verticalScroll$default;
                    Modifier m818paddingVpY3zN4$default = PaddingKt.m818paddingVpY3zN4$default(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), 0.0f, Dp.m7902constructorimpl(4), 1, null);
                    Arrangement.Horizontal m686spacedBy0680j_4 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
                    ComposerKt.sourceInformationMarkerStart(composer12, 844473419, str7);
                    MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(m686spacedBy0680j_4, Alignment.INSTANCE.getTop(), composer12, ((54 >> 3) & 14) | ((54 >> 3) & 112));
                    Arrangement.Horizontal horizontal4 = m686spacedBy0680j_4;
                    Composer composer14 = composer12;
                    ComposerKt.sourceInformationMarkerStart(composer14, -1159599143, str5);
                    int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer14, 0));
                    CompositionLocalMap currentCompositionLocalMap5 = composer14.getCurrentCompositionLocalMap();
                    String str13 = str7;
                    Modifier modifier3 = materializeModifier4;
                    Modifier modifier4 = m818paddingVpY3zN4$default;
                    Modifier materializeModifier5 = ComposedModifierKt.materializeModifier(composer14, modifier4);
                    Function0 constructor5 = ComposeUiNode.INSTANCE.getConstructor();
                    int i13 = ((((54 << 3) & 112) << 6) & 896) | 6;
                    ComposerKt.sourceInformationMarkerStart(composer14, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                    if (!(composer14.getApplier() instanceof Applier)) {
                        ComposablesKt.invalidApplier();
                    }
                    composer14.startReusableNode();
                    if (composer14.getInserting()) {
                        function05 = constructor5;
                        composer14.createNode(function05);
                    } else {
                        function05 = constructor5;
                        composer14.useNode();
                    }
                    Composer m4364constructorimpl5 = Updater.m4364constructorimpl(composer14);
                    Updater.m4372setimpl(m4364constructorimpl5, rowMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                    Updater.m4372setimpl(m4364constructorimpl5, currentCompositionLocalMap5, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                    Updater.m4368initimpl(m4364constructorimpl5, Integer.valueOf(hashCode5), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                    Updater.m4370reconcileimpl(m4364constructorimpl5, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                    Updater.m4372setimpl(m4364constructorimpl5, materializeModifier5, ComposeUiNode.INSTANCE.getSetModifier());
                    int i14 = (i13 >> 6) & 14;
                    ComposerKt.sourceInformationMarkerStart(composer14, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                    char c = 6;
                    int i15 = ((54 >> 6) & 112) | 6;
                    RowScope rowScope = RowScopeInstance.INSTANCE;
                    Composer composer15 = composer14;
                    ComposerKt.sourceInformationMarkerStart(composer15, 588478303, "C:BillingScreen.kt#7ez3px");
                    composer15.startReplaceGroup(1127362001);
                    ComposerKt.sourceInformation(composer15, "*4226@262371L1396,4216@261676L3197");
                    for (OptionItem optionItem2 : list) {
                        Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
                        MeasurePolicy measurePolicy2 = rowMeasurePolicy2;
                        if ((ItemCustomizationDialog$lambda$1 instanceof Collection) && ((Collection) ItemCustomizationDialog$lambda$1).isEmpty()) {
                            r6 = 0;
                        } else {
                            Iterator it2 = ItemCustomizationDialog$lambda$1.iterator();
                            while (true) {
                                if (!it2.hasNext()) {
                                    r6 = 0;
                                    break;
                                }
                                SelectedModifier selectedModifier = (SelectedModifier) it2.next();
                                Iterator it3 = it2;
                                Iterable iterable = ItemCustomizationDialog$lambda$1;
                                if (Intrinsics.areEqual(selectedModifier.getName(), optionItem2.getName()) && selectedModifier.getGroupId() == optionGroup.getId()) {
                                    r6 = 1;
                                    break;
                                }
                                it2 = it3;
                                ItemCustomizationDialog$lambda$1 = iterable;
                            }
                        }
                        Iterable iterable2 = r6;
                        Composer composer16 = composer14;
                        Modifier modifier5 = modifier4;
                        double price = optionItem2.getPrice();
                        Modifier modifier6 = materializeModifier5;
                        Function0 function07 = function0;
                        Composer composer17 = composer7;
                        Modifier m273borderxT4_qwU = BorderKt.m273borderxT4_qwU(BackgroundKt.m262backgroundbw27NRU$default(ClipKt.clip(RowScope.weight$default(rowScope, Modifier.INSTANCE, 1.0f, false, 2, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(12))), iterable2 != null ? ColorKt.getSaSGreen() : ColorKt.getInputDark(), null, 2, null), Dp.m7902constructorimpl(1), iterable2 != null ? ColorKt.getSaSGreen() : ColorKt.getCardBorderDark(), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(12)));
                        ComposerKt.sourceInformationMarkerStart(composer15, -48361699, str10);
                        boolean changedInstance = composer15.changedInstance(optionGroup) | composer15.changed(optionItem2) | composer15.changed(price) | composer15.changedInstance($context);
                        Composer composer18 = composer15;
                        Object rememberedValue = composer18.rememberedValue();
                        if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                            String str14 = str10;
                            optionItem = optionItem2;
                            composer2 = composer6;
                            str = str9;
                            composer3 = composer11;
                            horizontal = horizontal3;
                            horizontal2 = horizontal4;
                            columnScope = columnScope3;
                            str2 = str14;
                            Composer composer19 = composer8;
                            composer4 = composer15;
                            d = price;
                            str3 = str11;
                            str4 = str12;
                            composer5 = composer19;
                            obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda0
                                @Override // kotlin.jvm.functions.Function0
                                public final Object invoke() {
                                    Unit ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0;
                                    ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0(OptionGroup.this, optionItem, d, $context, $selectedModifiers$delegate);
                                    return ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0;
                                }
                            };
                            composer18.updateRememberedValue(obj);
                        } else {
                            Composer composer20 = composer8;
                            composer4 = composer15;
                            d = price;
                            str3 = str11;
                            composer5 = composer20;
                            composer2 = composer6;
                            str = str9;
                            composer3 = composer11;
                            str4 = str12;
                            horizontal = horizontal3;
                            horizontal2 = horizontal4;
                            columnScope = columnScope3;
                            str2 = str10;
                            optionItem = optionItem2;
                            obj = rememberedValue;
                        }
                        ComposerKt.sourceInformationMarkerEnd(composer4);
                        Modifier m816padding3ABfNKs2 = PaddingKt.m816padding3ABfNKs(ClickableKt.m297clickableoSLSa3U$default(m273borderxT4_qwU, false, null, null, null, (Function0) obj, 15, null), Dp.m7902constructorimpl(12));
                        Composer composer21 = composer4;
                        OptionGroup optionGroup2 = optionGroup;
                        ComposerKt.sourceInformationMarkerStart(composer21, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
                        MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(Alignment.INSTANCE.getTopStart(), false);
                        ComposerKt.sourceInformationMarkerStart(composer21, -1159599143, str5);
                        int hashCode6 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer21, 0));
                        CompositionLocalMap currentCompositionLocalMap6 = composer21.getCurrentCompositionLocalMap();
                        OptionItem optionItem3 = optionItem;
                        double d2 = d;
                        Modifier materializeModifier6 = ComposedModifierKt.materializeModifier(composer21, m816padding3ABfNKs2);
                        Function0 constructor6 = ComposeUiNode.INSTANCE.getConstructor();
                        int i16 = ((((0 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer21, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!(composer21.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        composer21.startReusableNode();
                        if (composer21.getInserting()) {
                            composer21.createNode(constructor6);
                        } else {
                            composer21.useNode();
                        }
                        Composer m4364constructorimpl6 = Updater.m4364constructorimpl(composer21);
                        Updater.m4372setimpl(m4364constructorimpl6, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl6, currentCompositionLocalMap6, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl6, Integer.valueOf(hashCode6), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl6, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl6, materializeModifier6, ComposeUiNode.INSTANCE.getSetModifier());
                        int i17 = (i16 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart(composer21, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
                        BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
                        int i18 = ((0 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer21, -1981898143, "C4244@263908L927:BillingScreen.kt#7ez3px");
                        ComposerKt.sourceInformationMarkerStart(composer21, 1341605231, str);
                        Modifier modifier7 = Modifier.INSTANCE;
                        MeasurePolicy columnMeasurePolicy4 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), composer21, ((0 >> 3) & 14) | ((0 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart(composer21, -1159599143, str5);
                        int hashCode7 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer21, 0));
                        String str15 = str5;
                        CompositionLocalMap currentCompositionLocalMap7 = composer21.getCurrentCompositionLocalMap();
                        Modifier materializeModifier7 = ComposedModifierKt.materializeModifier(composer21, modifier7);
                        Function0 constructor7 = ComposeUiNode.INSTANCE.getConstructor();
                        int i19 = ((((0 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer21, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!(composer21.getApplier() instanceof Applier)) {
                            ComposablesKt.invalidApplier();
                        }
                        composer21.startReusableNode();
                        if (composer21.getInserting()) {
                            function06 = constructor7;
                            composer21.createNode(function06);
                        } else {
                            function06 = constructor7;
                            composer21.useNode();
                        }
                        Composer m4364constructorimpl7 = Updater.m4364constructorimpl(composer21);
                        Updater.m4372setimpl(m4364constructorimpl7, columnMeasurePolicy4, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl7, currentCompositionLocalMap7, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl7, Integer.valueOf(hashCode7), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl7, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl7, materializeModifier7, ComposeUiNode.INSTANCE.getSetModifier());
                        int i20 = (i19 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart(composer21, 2093002350, str3);
                        ColumnScopeInstance columnScopeInstance3 = ColumnScopeInstance.INSTANCE;
                        int i21 = ((0 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart(composer21, -1584015274, "C4245@263961L340,4251@264346L447:BillingScreen.kt#7ez3px");
                        String upperCase3 = optionItem3.getName().toUpperCase(Locale.ROOT);
                        Intrinsics.checkNotNullExpressionValue(upperCase3, str4);
                        TextKt.m3069TextNvy7gAk(upperCase3, null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer21, 1597824, 0, 262058);
                        StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                        String format = String.format(Locale.US, "%.2f", Arrays.copyOf(new Object[]{Double.valueOf(d2)}, 1));
                        Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                        String str16 = "+ " + $currency + " " + format;
                        if (iterable2 != null) {
                            textSecondary = Color.m5092copywmQWz5c(r166, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r166) : 0.8f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r166) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r166) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(Color.INSTANCE.m5131getWhite0d7_KjU()) : 0.0f);
                        } else {
                            textSecondary = ColorKt.getTextSecondary();
                        }
                        TextKt.m3069TextNvy7gAk(str16, null, textSecondary, null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getMedium(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer21, 1597440, 0, 262058);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        composer21.endNode();
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        composer21.endNode();
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        ComposerKt.sourceInformationMarkerEnd(composer21);
                        str10 = str2;
                        str12 = str4;
                        columnScope3 = columnScope;
                        horizontal4 = horizontal2;
                        composer15 = composer4;
                        horizontal3 = horizontal;
                        optionGroup = optionGroup2;
                        composer8 = composer5;
                        rowMeasurePolicy2 = measurePolicy2;
                        composer14 = composer16;
                        str5 = str15;
                        function0 = function07;
                        composer7 = composer17;
                        str11 = str3;
                        str9 = str;
                        composer11 = composer3;
                        modifier4 = modifier5;
                        materializeModifier5 = modifier6;
                        composer6 = composer2;
                        c = 6;
                    }
                    String str17 = str5;
                    String str18 = str10;
                    Composer composer22 = composer7;
                    Composer composer23 = composer14;
                    Function0 function08 = function0;
                    Composer composer24 = composer6;
                    String str19 = str9;
                    Composer composer25 = composer11;
                    String str20 = str11;
                    String str21 = str12;
                    OptionGroup optionGroup3 = optionGroup;
                    Alignment.Horizontal horizontal5 = horizontal3;
                    Composer composer26 = composer8;
                    Composer composer27 = composer15;
                    ColumnScope columnScope4 = columnScope3;
                    composer27.endReplaceGroup();
                    if (list.size() < 2) {
                        composer = composer27;
                        composer.startReplaceGroup(591880242);
                        ComposerKt.sourceInformation(composer, "4261@265003L38");
                        SpacerKt.Spacer(RowScope.weight$default(rowScope, Modifier.INSTANCE, 1.0f, false, 2, null), composer, 0);
                        composer.endReplaceGroup();
                    } else {
                        composer = composer27;
                        composer.startReplaceGroup(591985952);
                        composer.endReplaceGroup();
                    }
                    ComposerKt.sourceInformationMarkerEnd(composer);
                    ComposerKt.sourceInformationMarkerEnd(composer14);
                    composer14.endNode();
                    ComposerKt.sourceInformationMarkerEnd(composer14);
                    ComposerKt.sourceInformationMarkerEnd(composer23);
                    ComposerKt.sourceInformationMarkerEnd(composer12);
                    str10 = str18;
                    str12 = str21;
                    columnScope3 = columnScope4;
                    horizontal3 = horizontal5;
                    optionGroup = optionGroup3;
                    composer8 = composer26;
                    verticalScroll$default = modifier2;
                    str5 = str17;
                    function0 = function08;
                    composer7 = composer22;
                    str11 = str20;
                    str9 = str19;
                    composer11 = composer25;
                    str7 = str13;
                    materializeModifier4 = modifier3;
                    composer6 = composer24;
                }
                composer12.endReplaceGroup();
                SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), composer12, 6);
                composer10 = composer12;
                str8 = str12;
                str6 = str11;
                composer11 = composer11;
                str7 = str7;
                columnMeasurePolicy3 = measurePolicy;
                composer9 = composer13;
                verticalScroll$default = verticalScroll$default;
                str5 = str5;
                str9 = str9;
                composer6 = composer6;
                materializeModifier4 = materializeModifier4;
            }
            Composer composer28 = composer7;
            Composer composer29 = composer9;
            Composer composer30 = composer6;
            Composer composer31 = composer8;
            Composer composer32 = composer11;
            Composer composer33 = composer10;
            composer33.endReplaceGroup();
            TextKt.m3069TextNvy7gAk("KITCHEN NOTE", PaddingKt.m818paddingVpY3zN4$default(Modifier.INSTANCE, 0.0f, Dp.m7902constructorimpl(8), 1, null), ColorKt.getTextSecondary(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer33, 1597494, 0, 262056);
            String ItemCustomizationDialog$lambda$4 = ItemCustomizationDialog$lambda$4($kitchenNote$delegate);
            Modifier m848height3ABfNKs = SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(75));
            TextFieldColors m2705colors0hiis_0 = OutlinedTextFieldDefaults.INSTANCE.m2705colors0hiis_0(Color.INSTANCE.m5131getWhite0d7_KjU(), Color.INSTANCE.m5131getWhite0d7_KjU(), 0L, 0L, ColorKt.getInputDark(), ColorKt.getInputDark(), 0L, 0L, 0L, 0L, null, ColorKt.getSaSGreen(), ColorKt.getCardBorderDark(), 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, composer33, 54, 0, 0, 0, 3072, 2147477452, 4095);
            RoundedCornerShape m1124RoundedCornerShape0680j_4 = RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(12));
            TextStyle textStyle = new TextStyle(0L, TextUnitKt.getSp(11), (FontWeight) null, (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777213, (DefaultConstructorMarker) null);
            ComposerKt.sourceInformationMarkerStart(composer33, 694206338, "CC(remember):BillingScreen.kt#9igjgp");
            Object rememberedValue2 = composer33.rememberedValue();
            if (rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                mutableState = $kitchenNote$delegate;
                Object obj2 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda1
                    @Override // kotlin.jvm.functions.Function1
                    public final Object invoke(Object obj3) {
                        Unit ItemCustomizationDialog$lambda$7$0$0$1$1$0;
                        ItemCustomizationDialog$lambda$7$0$0$1$1$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0$0$1$1$0(MutableState.this, (String) obj3);
                        return ItemCustomizationDialog$lambda$7$0$0$1$1$0;
                    }
                };
                composer33.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            } else {
                mutableState = $kitchenNote$delegate;
            }
            ComposerKt.sourceInformationMarkerEnd(composer33);
            OutlinedTextFieldKt.OutlinedTextField(ItemCustomizationDialog$lambda$4, (Function1<? super String, Unit>) rememberedValue2, m848height3ABfNKs, false, false, textStyle, (Function2<? super Composer, ? super Integer, Unit>) null, (Function2<? super Composer, ? super Integer, Unit>) ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$308535477$app(), (Function2<? super Composer, ? super Integer, Unit>) null, (Function2<? super Composer, ? super Integer, Unit>) null, (Function2<? super Composer, ? super Integer, Unit>) null, (Function2<? super Composer, ? super Integer, Unit>) null, (Function2<? super Composer, ? super Integer, Unit>) null, false, (VisualTransformation) null, (KeyboardOptions) null, (KeyboardActions) null, false, 2, 0, (MutableInteractionSource) null, (Shape) m1124RoundedCornerShape0680j_4, m2705colors0hiis_0, composer33, 12779952, 100663296, 0, 1834840);
            ComposerKt.sourceInformationMarkerEnd(composer33);
            ComposerKt.sourceInformationMarkerEnd(composer32);
            composer9.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer9);
            ComposerKt.sourceInformationMarkerEnd(composer29);
            ComposerKt.sourceInformationMarkerEnd(composer7);
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(16)), composer28, 6);
            ComposerKt.sourceInformationMarkerStart(composer28, 2093882009, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance2 = composer28.changedInstance($itemOptionGroups) | composer28.changedInstance($context) | composer28.changed($onAdd);
            Object rememberedValue3 = composer28.rememberedValue();
            if (changedInstance2 || rememberedValue3 == Composer.INSTANCE.getEmpty()) {
                final MutableState mutableState2 = mutableState;
                Object obj3 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda2
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit ItemCustomizationDialog$lambda$7$0$0$2$0;
                        ItemCustomizationDialog$lambda$7$0$0$2$0 = BillingScreenKt.ItemCustomizationDialog$lambda$7$0$0$2$0($itemOptionGroups, $context, $onAdd, $selectedModifiers$delegate, mutableState2);
                        return ItemCustomizationDialog$lambda$7$0$0$2$0;
                    }
                };
                composer28.updateRememberedValue(obj3);
                rememberedValue3 = obj3;
            }
            ComposerKt.sourceInformationMarkerEnd(composer28);
            ButtonKt.Button((Function0) rememberedValue3, SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(48)), false, RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(14)), ButtonDefaults.INSTANCE.m2121buttonColorsro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, composer28, ButtonDefaults.$stable << 12, 14), null, null, null, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$1960919636$app(), composer28, 805306416, 484);
            ComposerKt.sourceInformationMarkerEnd(composer28);
            ComposerKt.sourceInformationMarkerEnd(composer30);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd(composer31);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit ItemCustomizationDialog$lambda$7$0$0$1$0$0$0$0$1$0(OptionGroup $og, OptionItem $opt, double $optionPrice, Context $context, MutableState $selectedModifiers$delegate) {
        boolean exists;
        Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
        Collection arrayList = new ArrayList();
        for (Object obj : ItemCustomizationDialog$lambda$1) {
            if (((SelectedModifier) obj).getGroupId() == $og.getId()) {
                arrayList.add(obj);
            }
        }
        List sameGroupMods = (List) arrayList;
        Iterable ItemCustomizationDialog$lambda$12 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
        if (!(ItemCustomizationDialog$lambda$12 instanceof Collection) || !((Collection) ItemCustomizationDialog$lambda$12).isEmpty()) {
            Iterator it = ItemCustomizationDialog$lambda$12.iterator();
            while (true) {
                if (it.hasNext()) {
                    SelectedModifier selectedModifier = (SelectedModifier) it.next();
                    if (Intrinsics.areEqual(selectedModifier.getName(), $opt.getName()) && selectedModifier.getGroupId() == $og.getId()) {
                        exists = true;
                        break;
                    }
                } else {
                    exists = false;
                    break;
                }
            }
        } else {
            exists = false;
        }
        if (exists) {
            Iterable ItemCustomizationDialog$lambda$13 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList2 = new ArrayList();
            for (Object obj2 : ItemCustomizationDialog$lambda$13) {
                SelectedModifier selectedModifier2 = (SelectedModifier) obj2;
                if (!(Intrinsics.areEqual(selectedModifier2.getName(), $opt.getName()) && selectedModifier2.getGroupId() == $og.getId())) {
                    arrayList2.add(obj2);
                }
            }
            $selectedModifiers$delegate.setValue((List) arrayList2);
        } else if ($og.getMaxSelectable() == 1) {
            Iterable ItemCustomizationDialog$lambda$14 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList3 = new ArrayList();
            for (Object obj3 : ItemCustomizationDialog$lambda$14) {
                if (!(((SelectedModifier) obj3).getGroupId() == $og.getId())) {
                    arrayList3.add(obj3);
                }
            }
            $selectedModifiers$delegate.setValue(CollectionsKt.plus((Collection<? extends SelectedModifier>) arrayList3, new SelectedModifier($opt.getName(), $optionPrice, $og.getId())));
        } else if (sameGroupMods.size() >= $og.getMaxSelectable()) {
            Toast.makeText($context, "Max " + $og.getMaxSelectable() + " options allowed for " + $og.getName(), 0).show();
        } else {
            $selectedModifiers$delegate.setValue(CollectionsKt.plus((Collection<? extends SelectedModifier>) ItemCustomizationDialog$lambda$1($selectedModifiers$delegate), new SelectedModifier($opt.getName(), $optionPrice, $og.getId())));
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit ItemCustomizationDialog$lambda$7$0$0$1$1$0(MutableState $kitchenNote$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $kitchenNote$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit ItemCustomizationDialog$lambda$7$0$0$2$0(List $itemOptionGroups, Context $context, Function2 $onAdd, MutableState $selectedModifiers$delegate, MutableState $kitchenNote$delegate) {
        Iterator it = $itemOptionGroups.iterator();
        while (it.hasNext()) {
            OptionGroup og = (OptionGroup) it.next();
            Iterable ItemCustomizationDialog$lambda$1 = ItemCustomizationDialog$lambda$1($selectedModifiers$delegate);
            Collection arrayList = new ArrayList();
            Iterator it2 = ItemCustomizationDialog$lambda$1.iterator();
            while (true) {
                if (!it2.hasNext()) {
                    break;
                }
                Object next = it2.next();
                if (((SelectedModifier) next).getGroupId() == og.getId()) {
                    arrayList.add(next);
                }
            }
            List sameGroupMods = (List) arrayList;
            if (sameGroupMods.size() < og.getMinSelectable()) {
                Toast.makeText($context, "Please select at least " + og.getMinSelectable() + " option(s) for " + og.getName(), 1).show();
                return Unit.INSTANCE;
            }
        }
        $onAdd.invoke(ItemCustomizationDialog$lambda$1($selectedModifiers$delegate), ItemCustomizationDialog$lambda$4($kitchenNote$delegate));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Triple<String, String, String> parsePhoneNumber(String fullPhone) {
        String cleanPhone = StringsKt.trim((CharSequence) fullPhone).toString();
        List<CountryCodeItem> sortedCodes = CollectionsKt.sortedWith(countryCodes, new Comparator() { // from class: com.example.sasloopmanager.BillingScreenKt$parsePhoneNumber$$inlined$sortedByDescending$1
            /* JADX WARN: Multi-variable type inference failed */
            @Override // java.util.Comparator
            public final int compare(T t, T t2) {
                return ComparisonsKt.compareValues(Integer.valueOf(((CountryCodeItem) t2).getDialCode().length()), Integer.valueOf(((CountryCodeItem) t).getDialCode().length()));
            }
        });
        for (CountryCodeItem country : sortedCodes) {
            if (StringsKt.startsWith$default(cleanPhone, country.getDialCode(), false, 2, (Object) null)) {
                String code = country.getCode();
                String flag = country.getFlag();
                String substring = cleanPhone.substring(country.getDialCode().length());
                Intrinsics.checkNotNullExpressionValue(substring, "substring(...)");
                return new Triple<>(code, flag, substring);
            }
            String dialCodeNoPlus = StringsKt.removePrefix(country.getDialCode(), (CharSequence) "+");
            if (StringsKt.startsWith$default(cleanPhone, dialCodeNoPlus, false, 2, (Object) null)) {
                String code2 = country.getCode();
                String flag2 = country.getFlag();
                String substring2 = cleanPhone.substring(dialCodeNoPlus.length());
                Intrinsics.checkNotNullExpressionValue(substring2, "substring(...)");
                return new Triple<>(code2, flag2, substring2);
            }
        }
        return new Triple<>("IN", "🇮🇳", cleanPhone);
    }

    /* renamed from: CompactTextField-03iij_k, reason: not valid java name */
    private static final void m8474CompactTextField03iij_k(final String value, final Function1<? super String, Unit> function1, final String placeholder, Modifier modifier, KeyboardOptions keyboardOptions, boolean singleLine, long fontSize, CornerBasedShape shape, Composer $composer, final int $changed, final int i) {
        String str;
        Function1<? super String, Unit> function12;
        Modifier modifier2;
        KeyboardOptions keyboardOptions2;
        boolean singleLine2;
        int i2;
        long fontSize2;
        Composer $composer2;
        final KeyboardOptions keyboardOptions3;
        final long fontSize3;
        final CornerBasedShape shape2;
        final Modifier modifier3;
        final boolean singleLine3;
        RoundedCornerShape shape3;
        long fontSize4;
        boolean singleLine4;
        int $dirty;
        KeyboardOptions keyboardOptions4;
        int i3;
        Composer $composer3 = $composer.startRestartGroup(-2121916777);
        ComposerKt.sourceInformation($composer3, "C(CompactTextField)N(value,onValueChange,placeholder,modifier,keyboardOptions,singleLine,fontSize:c#ui.unit.TextUnit,shape)4386@270679L11,4387@270742L11,4388@270805L11,4389@270871L11,4403@271411L609,4391@270896L1130:BillingScreen.kt#7ez3px");
        int $dirty2 = $changed;
        if (($changed & 6) == 0) {
            str = value;
            $dirty2 |= $composer3.changed(str) ? 4 : 2;
        } else {
            str = value;
        }
        if (($changed & 48) == 0) {
            function12 = function1;
            $dirty2 |= $composer3.changedInstance(function12) ? 32 : 16;
        } else {
            function12 = function1;
        }
        if (($changed & 384) == 0) {
            $dirty2 |= $composer3.changed(placeholder) ? 256 : 128;
        }
        int i4 = i & 8;
        if (i4 != 0) {
            $dirty2 |= 3072;
            modifier2 = modifier;
        } else if (($changed & 3072) == 0) {
            modifier2 = modifier;
            $dirty2 |= $composer3.changed(modifier2) ? 2048 : 1024;
        } else {
            modifier2 = modifier;
        }
        int i5 = i & 16;
        if (i5 != 0) {
            $dirty2 |= 24576;
            keyboardOptions2 = keyboardOptions;
        } else if (($changed & 24576) == 0) {
            keyboardOptions2 = keyboardOptions;
            $dirty2 |= $composer3.changed(keyboardOptions2) ? 16384 : 8192;
        } else {
            keyboardOptions2 = keyboardOptions;
        }
        int i6 = i & 32;
        if (i6 != 0) {
            $dirty2 |= ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE;
            singleLine2 = singleLine;
        } else if ((196608 & $changed) == 0) {
            singleLine2 = singleLine;
            $dirty2 |= $composer3.changed(singleLine2) ? 131072 : 65536;
        } else {
            singleLine2 = singleLine;
        }
        int i7 = i & 64;
        if (i7 != 0) {
            $dirty2 |= 1572864;
            i2 = i4;
            fontSize2 = fontSize;
        } else if (($changed & 1572864) == 0) {
            i2 = i4;
            fontSize2 = fontSize;
            $dirty2 |= $composer3.changed(fontSize2) ? 1048576 : 524288;
        } else {
            i2 = i4;
            fontSize2 = fontSize;
        }
        if (($changed & 12582912) == 0) {
            if ((i & 128) == 0 && $composer3.changed(shape)) {
                i3 = 8388608;
                $dirty2 |= i3;
            }
            i3 = 4194304;
            $dirty2 |= i3;
        }
        int $dirty3 = $dirty2;
        if (!$composer3.shouldExecute(($dirty2 & 4793491) != 4793490, $dirty3 & 1)) {
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
            keyboardOptions3 = keyboardOptions2;
            fontSize3 = fontSize2;
            shape2 = shape;
            modifier3 = modifier2;
            singleLine3 = singleLine2;
        } else {
            $composer3.startDefaults();
            if (($changed & 1) != 0 && !$composer3.getDefaultsInvalid()) {
                $composer3.skipToGroupEnd();
                if ((i & 128) != 0) {
                    $dirty = $dirty3 & (-29360129);
                    fontSize4 = fontSize2;
                    keyboardOptions4 = keyboardOptions2;
                    singleLine4 = singleLine2;
                    shape3 = shape;
                } else {
                    shape3 = shape;
                    fontSize4 = fontSize2;
                    singleLine4 = singleLine2;
                    $dirty = $dirty3;
                    keyboardOptions4 = keyboardOptions2;
                }
            } else {
                if (i2 != 0) {
                    modifier2 = Modifier.INSTANCE;
                }
                if (i5 != 0) {
                    keyboardOptions2 = KeyboardOptions.INSTANCE.getDefault();
                }
                if (i6 != 0) {
                    singleLine2 = true;
                }
                if (i7 != 0) {
                    fontSize2 = TextUnitKt.getSp(11);
                }
                if ((i & 128) == 0) {
                    shape3 = shape;
                    fontSize4 = fontSize2;
                    singleLine4 = singleLine2;
                    $dirty = $dirty3;
                    keyboardOptions4 = keyboardOptions2;
                } else {
                    shape3 = RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(18));
                    $dirty = $dirty3 & (-29360129);
                    fontSize4 = fontSize2;
                    keyboardOptions4 = keyboardOptions2;
                    singleLine4 = singleLine2;
                }
            }
            $composer3.endDefaults();
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-2121916777, $dirty, -1, "com.example.sasloopmanager.CompactTextField (BillingScreen.kt:4385)");
            }
            long TextPrimary = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getOnBackground();
            final long TextSecondary = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getOnSurfaceVariant();
            long InputDark = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getSurfaceVariant();
            long CardBorderDark = MaterialTheme.INSTANCE.getColorScheme($composer3, MaterialTheme.$stable).getOutline();
            CornerBasedShape shape4 = shape3;
            int $dirty4 = $dirty;
            final String str2 = str;
            final long fontSize5 = fontSize4;
            $composer2 = $composer3;
            BasicTextFieldKt.BasicTextField(value, function12, PaddingKt.m818paddingVpY3zN4$default(BorderKt.m273borderxT4_qwU(BackgroundKt.m261backgroundbw27NRU(SizeKt.m848height3ABfNKs(modifier2, Dp.m7902constructorimpl(40)), InputDark, shape3), Dp.m7902constructorimpl(1), CardBorderDark, shape4), Dp.m7902constructorimpl(12), 0.0f, 2, null), false, false, new TextStyle(TextPrimary, fontSize4, FontWeight.INSTANCE.getMedium(), (FontStyle) null, (FontSynthesis) null, (FontFamily) null, (String) null, 0L, (BaselineShift) null, (TextGeometricTransform) null, (LocaleList) null, 0L, (TextDecoration) null, (Shadow) null, (DrawStyle) null, 0, 0, 0L, (TextIndent) null, (PlatformTextStyle) null, (LineHeightStyle) null, 0, 0, (TextMotion) null, 16777208, (DefaultConstructorMarker) null), keyboardOptions4, (KeyboardActions) null, singleLine4, 0, 0, (VisualTransformation) null, (Function1<? super TextLayoutResult, Unit>) null, (MutableInteractionSource) null, (Brush) new SolidColor(ColorKt.getSaSGreen(), null), (Function3<? super Function2<? super Composer, ? super Integer, Unit>, ? super Composer, ? super Integer, Unit>) ComposableLambdaKt.rememberComposableLambda(-1064281324, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda66
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.CompactTextField_03iij_k$lambda$0(str2, placeholder, TextSecondary, fontSize5, (Function2) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer3, 54), $composer2, ($dirty4 & 14) | ($dirty4 & 112) | (3670016 & ($dirty4 << 6)) | (($dirty4 << 9) & 234881024), ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE, 16024);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            modifier3 = modifier2;
            keyboardOptions3 = keyboardOptions4;
            singleLine3 = singleLine4;
            shape2 = shape4;
            fontSize3 = fontSize5;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda67
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.CompactTextField_03iij_k$lambda$1(value, function1, placeholder, modifier3, keyboardOptions3, singleLine3, fontSize3, shape2, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit CompactTextField_03iij_k$lambda$0(String $value, String $placeholder, long $TextSecondary, long $fontSize, Function2 innerTextField, Composer $composer, int $changed) {
        Function0 function0;
        Intrinsics.checkNotNullParameter(innerTextField, "innerTextField");
        ComposerKt.sourceInformation($composer, "CN(innerTextField)4404@271443L567:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer.changedInstance(innerTextField) ? 4 : 2;
        }
        if ($composer.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1064281324, $dirty, -1, "com.example.sasloopmanager.CompactTextField.<anonymous> (BillingScreen.kt:4404)");
            }
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.INSTANCE, 0.0f, 1, null);
            Alignment centerStart = Alignment.INSTANCE.getCenterStart();
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(centerStart, false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int $dirty2 = $dirty;
            int i = ((((54 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
                function0 = constructor;
                $composer.createNode(function0);
            } else {
                function0 = constructor;
                $composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl, maybeCachedBoxMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1833054614, "C72@3469L9:Box.kt#2w3rfo");
            BoxScopeInstance boxScopeInstance = BoxScopeInstance.INSTANCE;
            int i3 = ((54 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1721972271, "C4418@271980L16:BillingScreen.kt#7ez3px");
            if ($value.length() == 0) {
                $composer.startReplaceGroup(-1721932530);
                ComposerKt.sourceInformation($composer, "4409@271631L314");
                TextKt.m3069TextNvy7gAk($placeholder, null, $TextSecondary, null, $fontSize, null, FontWeight.INSTANCE.getMedium(), null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 1, 0, null, null, $composer, 1572864, 24960, 241578);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1721612920);
                $composer.endReplaceGroup();
            }
            innerTextField.invoke($composer, Integer.valueOf($dirty2 & 14));
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    private static final void ThermalGridRow(final String left, String right, Composer $composer, final int $changed) {
        final String str;
        Composer $composer2;
        Composer $composer3 = $composer.startRestartGroup(592293593);
        ComposerKt.sourceInformation($composer3, "C(ThermalGridRow)N(left,right)4426@272104L290:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            $dirty |= $composer3.changed(left) ? 4 : 2;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer3.changed(right) ? 32 : 16;
        }
        if (!$composer3.shouldExecute(($dirty & 19) != 18, $dirty & 1)) {
            str = right;
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(592293593, $dirty, -1, "com.example.sasloopmanager.ThermalGridRow (BillingScreen.kt:4425)");
            }
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer3, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer3, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer3, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer3, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer3.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer3, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer3, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer3.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer3.startReusableNode();
            if ($composer3.getInserting()) {
                $composer3.createNode(constructor);
            } else {
                $composer3.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer3);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i2 = (i >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer3, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i3 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer3, 94740612, "C4431@272282L48,4432@272339L49:BillingScreen.kt#7ez3px");
            $composer2 = $composer3;
            TextKt.m3069TextNvy7gAk(left, null, Color.INSTANCE.m5120getBlack0d7_KjU(), null, TextUnitKt.getSp(9), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer3, ($dirty & 14) | 24960, 0, 262122);
            str = right;
            TextKt.m3069TextNvy7gAk(str, null, Color.INSTANCE.m5120getBlack0d7_KjU(), null, TextUnitKt.getSp(9), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer3, (($dirty >> 3) & 14) | 24960, 0, 262122);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            $composer3.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer3);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            ComposerKt.sourceInformationMarkerEnd($composer3);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda51
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ThermalGridRow$lambda$1(left, str, $changed, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* renamed from: ThermalReceiptRow-JHQioms, reason: not valid java name */
    private static final void m8477ThermalReceiptRowJHQioms(final String label, final String value, boolean isBold, long fontSize, Composer $composer, final int $changed, final int i) {
        String str;
        boolean z;
        long fontSize2;
        final boolean isBold2;
        final long fontSize3;
        boolean isBold3;
        Function0 function0;
        Composer $composer2 = $composer.startRestartGroup(46195100);
        ComposerKt.sourceInformation($composer2, "C(ThermalReceiptRow)N(label,value,isBold,fontSize:c#ui.unit.TextUnit)4443@272571L744:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            str = label;
            $dirty |= $composer2.changed(str) ? 4 : 2;
        } else {
            str = label;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(value) ? 32 : 16;
        }
        int i2 = i & 4;
        if (i2 != 0) {
            $dirty |= 384;
            z = isBold;
        } else if (($changed & 384) == 0) {
            z = isBold;
            $dirty |= $composer2.changed(z) ? 256 : 128;
        } else {
            z = isBold;
        }
        int i3 = i & 8;
        if (i3 != 0) {
            $dirty |= 3072;
            fontSize2 = fontSize;
        } else if (($changed & 3072) == 0) {
            fontSize2 = fontSize;
            $dirty |= $composer2.changed(fontSize2) ? 2048 : 1024;
        } else {
            fontSize2 = fontSize;
        }
        if ($composer2.shouldExecute(($dirty & 1171) != 1170, $dirty & 1)) {
            if (i2 != 0) {
                isBold3 = false;
            } else {
                isBold3 = z;
            }
            if (i3 != 0) {
                fontSize2 = TextUnitKt.getSp(9);
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(46195100, $dirty, -1, "com.example.sasloopmanager.ThermalReceiptRow (BillingScreen.kt:4442)");
            }
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer2, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer2, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer2, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer2, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer2.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer2, fillMaxWidth$default);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int $dirty2 = $dirty;
            int i4 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer2, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer2.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            $composer2.startReusableNode();
            if ($composer2.getInserting()) {
                function0 = constructor;
                $composer2.createNode(function0);
            } else {
                function0 = constructor;
                $composer2.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl($composer2);
            Updater.m4372setimpl(m4364constructorimpl, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            boolean isBold4 = isBold3;
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer2, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            int i6 = ((438 >> 6) & 112) | 6;
            RowScope rowScope = RowScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer2, 577695707, "C4448@272749L38,4449@272796L236,4456@273041L268:BillingScreen.kt#7ez3px");
            SpacerKt.Spacer(RowScope.weight$default(rowScope, Modifier.INSTANCE, 1.0f, false, 2, null), $composer2, 0);
            long m5120getBlack0d7_KjU = Color.INSTANCE.m5120getBlack0d7_KjU();
            FontWeight.Companion companion = FontWeight.INSTANCE;
            long fontSize4 = fontSize2;
            TextKt.m3069TextNvy7gAk(str, PaddingKt.m820paddingqDBjuR0$default(Modifier.INSTANCE, 0.0f, 0.0f, Dp.m7902constructorimpl(8), 0.0f, 11, null), m5120getBlack0d7_KjU, null, fontSize4, null, isBold4 ? companion.getBold() : companion.getNormal(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, ($dirty2 & 14) | 432 | (($dirty2 << 3) & 57344), 0, 262056);
            long m5120getBlack0d7_KjU2 = Color.INSTANCE.m5120getBlack0d7_KjU();
            FontWeight.Companion companion2 = FontWeight.INSTANCE;
            TextKt.m3069TextNvy7gAk(value, SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(80)), m5120getBlack0d7_KjU2, null, fontSize4, null, isBold4 ? companion2.getBold() : companion2.getNormal(), null, 0L, null, TextAlign.m7748boximpl(TextAlign.INSTANCE.m7756getEnde0LSkKk()), 0L, 0, false, 0, 0, null, null, $composer2, (($dirty2 >> 3) & 14) | 432 | (($dirty2 << 3) & 57344), 0, 261032);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            fontSize3 = fontSize4;
            isBold2 = isBold4;
        } else {
            $composer2.skipToGroupEnd();
            isBold2 = z;
            fontSize3 = fontSize2;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda4
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ThermalReceiptRow_JHQioms$lambda$1(label, value, isBold2, fontSize3, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }
}
