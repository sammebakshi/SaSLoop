package com.example.sasloopmanager;

import androidx.compose.foundation.BackgroundKt;
import androidx.compose.foundation.BorderStrokeKt;
import androidx.compose.foundation.ClickableKt;
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
import androidx.compose.foundation.lazy.LazyItemScope;
import androidx.compose.foundation.lazy.LazyListScope;
import androidx.compose.foundation.lazy.grid.LazyGridItemScope;
import androidx.compose.foundation.lazy.grid.LazyGridScope;
import androidx.compose.foundation.shape.RoundedCornerShape;
import androidx.compose.foundation.shape.RoundedCornerShapeKt;
import androidx.compose.material.MenuKt;
import androidx.compose.material.icons.Icons;
import androidx.compose.material.icons.filled.LockKt;
import androidx.compose.material.icons.filled.RemoveKt;
import androidx.compose.material.icons.filled.ShoppingCartKt;
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
import androidx.compose.material3.SelectableChipColors;
import androidx.compose.material3.SurfaceKt;
import androidx.compose.material3.TabKt;
import androidx.compose.material3.TextKt;
import androidx.compose.runtime.Applier;
import androidx.compose.runtime.ComposablesKt;
import androidx.compose.runtime.Composer;
import androidx.compose.runtime.ComposerKt;
import androidx.compose.runtime.CompositionLocalMap;
import androidx.compose.runtime.MutableState;
import androidx.compose.runtime.RecomposeScopeImplKt;
import androidx.compose.runtime.ScopeUpdateScope;
import androidx.compose.runtime.State;
import androidx.compose.runtime.Updater;
import androidx.compose.runtime.internal.ComposableLambda;
import androidx.compose.runtime.internal.ComposableLambdaKt;
import androidx.compose.ui.Alignment;
import androidx.compose.ui.ComposedModifierKt;
import androidx.compose.ui.Modifier;
import androidx.compose.ui.draw.ClipKt;
import androidx.compose.ui.graphics.Color;
import androidx.compose.ui.graphics.vector.ImageVector;
import androidx.compose.ui.layout.MeasurePolicy;
import androidx.compose.ui.node.ComposeUiNode;
import androidx.compose.ui.text.font.FontWeight;
import androidx.compose.ui.text.style.TextOverflow;
import androidx.compose.ui.tooling.preview.AndroidUiModes;
import androidx.compose.ui.unit.Dp;
import androidx.compose.ui.unit.TextUnitKt;
import androidx.profileinstaller.ProfileVerifier;
import com.example.sasloopmanager.data.CategoryItem;
import com.example.sasloopmanager.data.MenuItem;
import com.example.sasloopmanager.data.Order;
import com.example.sasloopmanager.data.TableItem;
import com.example.sasloopmanager.theme.ColorKt;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import kotlin.Metadata;
import kotlin.Unit;
import kotlin.collections.CollectionsKt;
import kotlin.jvm.functions.Function0;
import kotlin.jvm.functions.Function1;
import kotlin.jvm.functions.Function2;
import kotlin.jvm.functions.Function3;
import kotlin.jvm.functions.Function4;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.StringCompanionObject;
import kotlin.ranges.RangesKt;
import kotlin.text.StringsKt;

/* compiled from: BillingScreen.kt */
@Metadata(d1 = {"\u0000\u0080\u0001\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u000b\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0010 \n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010$\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u000f\u001a\u0015\u0010\u0000\u001a\u00020\u00012\u0006\u0010\u0002\u001a\u00020\u0003H\u0007¢\u0006\u0002\u0010\u0004\u001aG\u0010\u0005\u001a\u00020\u00012\b\b\u0002\u0010\u0006\u001a\u00020\u00072\u0006\u0010\b\u001a\u00020\t2\u0006\u0010\n\u001a\u00020\t2\u0006\u0010\u000b\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\u000e2\f\u0010\u000f\u001a\b\u0012\u0004\u0012\u00020\u00010\u0010H\u0003¢\u0006\u0004\b\u0011\u0010\u0012\u001a=\u0010\u0013\u001a\u00020\u00012\u0006\u0010\u0014\u001a\u00020\u00152\u0006\u0010\u0016\u001a\u00020\u00172\b\u0010\u0018\u001a\u0004\u0018\u00010\u00192\u0006\u0010\u001a\u001a\u00020\u001b2\f\u0010\u000f\u001a\b\u0012\u0004\u0012\u00020\u00010\u0010H\u0003¢\u0006\u0002\u0010\u001c\u001aA\u0010\u001d\u001a\u00020\u00012\u0006\u0010\u001e\u001a\u00020\u001f2\u0006\u0010 \u001a\u00020\u001b2\u0006\u0010!\u001a\u00020\u001b2\f\u0010\"\u001a\b\u0012\u0004\u0012\u00020\u00010\u00102\f\u0010#\u001a\b\u0012\u0004\u0012\u00020\u00010\u0010H\u0003¢\u0006\u0002\u0010$\u001a=\u0010%\u001a\u00020\u00012\u0006\u0010&\u001a\u00020\t2\u0006\u0010'\u001a\u00020\t2\b\b\u0002\u0010(\u001a\u00020\u00172\b\b\u0002\u0010)\u001a\u00020\u000e2\b\b\u0002\u0010*\u001a\u00020+H\u0003¢\u0006\u0004\b,\u0010-¨\u0006.²\u0006\u0010\u0010/\u001a\b\u0012\u0004\u0012\u00020\u001f00X\u008a\u0084\u0002²\u0006\u0010\u00101\u001a\b\u0012\u0004\u0012\u00020200X\u008a\u0084\u0002²\u0006\n\u00103\u001a\u00020\tX\u008a\u0084\u0002²\u0006\n\u00104\u001a\u00020\tX\u008a\u0084\u0002²\u0006\u0016\u00105\u001a\u000e\u0012\u0004\u0012\u00020\u001f\u0012\u0004\u0012\u00020\u001b06X\u008a\u0084\u0002²\u0006\u0016\u00107\u001a\u000e\u0012\u0004\u0012\u00020\u001f\u0012\u0004\u0012\u00020\u001b06X\u008a\u0084\u0002²\u0006\u0010\u00108\u001a\b\u0012\u0004\u0012\u00020\u001500X\u008a\u0084\u0002²\u0006\u0010\u00109\u001a\b\u0012\u0004\u0012\u00020:00X\u008a\u0084\u0002²\u0006\n\u0010;\u001a\u00020<X\u008a\u0084\u0002²\u0006\n\u0010=\u001a\u00020\tX\u008a\u0084\u0002²\u0006\f\u0010>\u001a\u0004\u0018\u00010\u0015X\u008a\u0084\u0002²\u0006\n\u0010?\u001a\u00020\u0017X\u008a\u0084\u0002²\u0006\f\u0010@\u001a\u0004\u0018\u00010\tX\u008a\u0084\u0002²\u0006\f\u0010A\u001a\u0004\u0018\u00010\u0017X\u008a\u0084\u0002²\u0006\n\u0010B\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010C\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010D\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010E\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010F\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010G\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010H\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010I\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010J\u001a\u00020\tX\u008a\u008e\u0002²\u0006\n\u0010K\u001a\u00020\tX\u008a\u008e\u0002"}, d2 = {"BillingScreen", "", "billingViewModel", "Lcom/example/sasloopmanager/BillingViewModel;", "(Lcom/example/sasloopmanager/BillingViewModel;Landroidx/compose/runtime/Composer;I)V", "FlowCard", "modifier", "Landroidx/compose/ui/Modifier;", "title", "", "subtext", "icon", "Landroidx/compose/ui/graphics/vector/ImageVector;", "iconColor", "Landroidx/compose/ui/graphics/Color;", "onClick", "Lkotlin/Function0;", "FlowCard-FHprtrg", "(Landroidx/compose/ui/Modifier;Ljava/lang/String;Ljava/lang/String;Landroidx/compose/ui/graphics/vector/ImageVector;JLkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;II)V", "TableCard", "table", "Lcom/example/sasloopmanager/data/TableItem;", "isOccupied", "", "orderTotal", "", "orderItemsCount", "", "(Lcom/example/sasloopmanager/data/TableItem;ZLjava/lang/Double;ILkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;I)V", "MenuItemCard", "item", "Lcom/example/sasloopmanager/data/MenuItem;", "qtyInCart", "punchedQty", "onAdd", "onRemove", "(Lcom/example/sasloopmanager/data/MenuItem;IILkotlin/jvm/functions/Function0;Lkotlin/jvm/functions/Function0;Landroidx/compose/runtime/Composer;I)V", "ReceiptRow", "label", "value", "isBold", "color", "fontSize", "Landroidx/compose/ui/unit/TextUnit;", "ReceiptRow-6jM-SoI", "(Ljava/lang/String;Ljava/lang/String;ZJJLandroidx/compose/runtime/Composer;II)V", "app", "catalog", "", "categories", "Lcom/example/sasloopmanager/data/CategoryItem;", "selectedCategory", "searchQuery", "cart", "", "oldKotItems", "tables", "activeOrders", "Lcom/example/sasloopmanager/data/Order;", "flowState", "Lcom/example/sasloopmanager/BillingFlowState;", "activeFlow", "selectedTable", "isLoading", "error", "orderSuccess", "activeSubTab", "customerName", "customerPhone", "orderType", "paymentMethod", "discountInput", "serviceChargeInput", "deliveryChargeInput", "preOrderIdInput", "advancePaidInput"}, k = 2, mv = {2, 3, 0}, xi = AndroidUiModes.UI_MODE_NIGHT_MASK)
/* loaded from: classes3.dex */
public final class BillingScreenKt {

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
    public static final Unit BillingScreen$lambda$49(BillingViewModel billingViewModel, int i, Composer composer, int i2) {
        BillingScreen(billingViewModel, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit FlowCard_FHprtrg$lambda$1(Modifier modifier, String str, String str2, ImageVector imageVector, long j, Function0 function0, int i, int i2, Composer composer, int i3) {
        m8419FlowCardFHprtrg(modifier, str, str2, imageVector, j, function0, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit MenuItemCard$lambda$1(MenuItem menuItem, int i, int i2, Function0 function0, Function0 function02, int i3, Composer composer, int i4) {
        MenuItemCard(menuItem, i, i2, function0, function02, composer, RecomposeScopeImplKt.updateChangedFlags(i3 | 1));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit ReceiptRow_6jM_SoI$lambda$1(String str, String str2, boolean z, long j, long j2, int i, int i2, Composer composer, int i3) {
        m8420ReceiptRow6jMSoI(str, str2, z, j, j2, composer, RecomposeScopeImplKt.updateChangedFlags(i | 1), i2);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit TableCard$lambda$1(TableItem tableItem, boolean z, Double d, int i, Function0 function0, int i2, Composer composer, int i3) {
        TableCard(tableItem, z, d, i, function0, composer, RecomposeScopeImplKt.updateChangedFlags(i2 | 1));
        return Unit.INSTANCE;
    }

    /*  JADX ERROR: Type inference failed
        jadx.core.utils.exceptions.JadxOverflowException: Type update terminated with stack overflow, arg: (r102v3 ??), method size: 19048
        	at jadx.core.utils.ErrorsCounter.addError(ErrorsCounter.java:59)
        	at jadx.core.utils.ErrorsCounter.error(ErrorsCounter.java:31)
        	at jadx.core.dex.attributes.nodes.NotificationAttrNode.addError(NotificationAttrNode.java:19)
        	at jadx.core.dex.visitors.typeinference.TypeInferenceVisitor.visit(TypeInferenceVisitor.java:77)
        */
    /* JADX DEBUG: Don't trust debug lines info. Repeating lines: [158=4, 493=4] */
    public static final void BillingScreen(com.example.sasloopmanager.BillingViewModel r286, androidx.compose.runtime.Composer r287, int r288) {
        /*
            r1 = r286
            r6 = r288
            java.lang.String r0 = "billingViewModel"
            kotlin.jvm.internal.Intrinsics.checkNotNullParameter(r1, r0)
            r0 = 431652994(0x19ba8082, float:1.9283853E-23)
            r2 = r287
            androidx.compose.runtime.Composer r11 = r2.startRestartGroup(r0)
            java.lang.String r0 = "C(BillingScreen)N(billingViewModel)42@1881L29,43@1961L29,44@2053L29,45@2135L29,46@2203L29,47@2285L29,48@2357L29,49@2441L29,50@2519L29,51@2599L29,52@2685L29,53@2763L29,54@2833L29,55@2917L29,58@3065L58,61@3218L69,62@3313L69,63@3404L249,72@3679L73,73@3778L69,74@3878L69,75@3979L69,76@4076L137,79@4242L69,82@4435L672,82@4391L716,126@6338L57322:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformation(r11, r0)
            r0 = r288
            r2 = r6 & 6
            r3 = 2
            if (r2 != 0) goto L28
            boolean r2 = r11.changedInstance(r1)
            if (r2 == 0) goto L26
            r2 = 4
            goto L27
        L26:
            r2 = r3
        L27:
            r0 = r0 | r2
        L28:
            r2 = r0 & 3
            if (r2 == r3) goto L2e
            r2 = 1
            goto L2f
        L2e:
            r2 = 0
        L2f:
            r7 = r0 & 1
            boolean r2 = r11.shouldExecute(r2, r7)
            if (r2 == 0) goto L4a25
            boolean r2 = androidx.compose.runtime.ComposerKt.isTraceInProgress()
            if (r2 == 0) goto L46
            r2 = -1
            java.lang.String r7 = "com.example.sasloopmanager.BillingScreen (BillingScreen.kt:41)"
            r8 = 431652994(0x19ba8082, float:1.9283853E-23)
            androidx.compose.runtime.ComposerKt.traceEventStart(r8, r0, r2, r7)
        L46:
            kotlinx.coroutines.flow.StateFlow r7 = r1.getCatalog()
            r12 = 0
            r13 = 7
            r8 = 0
            r9 = 0
            r10 = 0
            androidx.compose.runtime.State r2 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getCategories()
            androidx.compose.runtime.State r14 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getSelectedCategory()
            androidx.compose.runtime.State r15 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getSearchQuery()
            androidx.compose.runtime.State r29 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getCart()
            androidx.compose.runtime.State r7 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            r8 = r7
            kotlinx.coroutines.flow.StateFlow r7 = r1.getOldKotItems()
            r9 = r8
            r8 = 0
            r10 = r9
            r9 = 0
            r16 = r10
            r10 = 0
            r287 = r16
            androidx.compose.runtime.State r7 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            r8 = r7
            kotlinx.coroutines.flow.StateFlow r7 = r1.getTables()
            r9 = r8
            r8 = 0
            r10 = r9
            r9 = 0
            r16 = r10
            r10 = 0
            r30 = r16
            androidx.compose.runtime.State r7 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            r8 = r7
            kotlinx.coroutines.flow.StateFlow r7 = r1.getActiveOrders()
            r9 = r8
            r8 = 0
            r10 = r9
            r9 = 0
            r16 = r10
            r10 = 0
            r31 = r16
            androidx.compose.runtime.State r20 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getFlowState()
            r16 = r20
            androidx.compose.runtime.State r18 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getActiveFlow()
            r17 = r18
            androidx.compose.runtime.State r19 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getSelectedTable()
            r54 = r19
            androidx.compose.runtime.State r7 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            r8 = r7
            kotlinx.coroutines.flow.StateFlow r7 = r1.isLoading()
            r9 = r8
            r8 = 0
            r10 = r9
            r9 = 0
            r18 = r10
            r10 = 0
            r19 = r18
            androidx.compose.runtime.State r55 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getError()
            androidx.compose.runtime.State r56 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            kotlinx.coroutines.flow.StateFlow r7 = r1.getOrderSuccess()
            androidx.compose.runtime.State r57 = androidx.lifecycle.compose.FlowExtKt.collectAsStateWithLifecycle(r7, r8, r9, r10, r11, r12, r13)
            com.example.sasloopmanager.BillingFlowState r7 = BillingScreen$lambda$8(r17)
            java.lang.String r8 = BillingScreen$lambda$9(r54)
            r9 = -1793259332(0xffffffff951d08bc, float:-3.1712788E-26)
            java.lang.String r10 = "CC(remember):BillingScreen.kt#9igjgp"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r9, r10)
            java.lang.Enum r7 = (java.lang.Enum) r7
            int r7 = r7.ordinal()
            boolean r7 = r11.changed(r7)
            boolean r8 = r11.changed(r8)
            r7 = r7 | r8
            r8 = r11
            r9 = 0
            java.lang.Object r12 = r8.rememberedValue()
            r13 = 0
            r18 = r9
            r9 = 0
            if (r7 != 0) goto L11f
            androidx.compose.runtime.Composer$Companion r20 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r5 = r20.getEmpty()
            if (r12 != r5) goto L11e
            goto L11f
        L11e:
            goto L12b
        L11f:
            r5 = 0
            java.lang.String r4 = "MENU"
            androidx.compose.runtime.MutableState r4 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r4, r9, r3, r9)
            r8.updateRememberedValue(r4)
            r12 = r4
        L12b:
            r5 = r12
            androidx.compose.runtime.MutableState r5 = (androidx.compose.runtime.MutableState) r5
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r4 = BillingScreen$lambda$8(r17)
            java.lang.String r7 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r8 = BillingScreen$lambda$10(r19)
            r12 = -1793254425(0xffffffff951d1be7, float:-3.172791E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r12, r10)
            java.lang.Enum r4 = (java.lang.Enum) r4
            int r4 = r4.ordinal()
            boolean r4 = r11.changed(r4)
            boolean r7 = r11.changed(r7)
            r4 = r4 | r7
            boolean r7 = r11.changed(r8)
            r4 = r4 | r7
            r7 = r11
            r8 = 0
            java.lang.Object r12 = r7.rememberedValue()
            r13 = 0
            r26 = r14
            java.lang.String r14 = ""
            if (r4 != 0) goto L171
            androidx.compose.runtime.Composer$Companion r18 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r3 = r18.getEmpty()
            if (r12 != r3) goto L16e
            goto L171
        L16e:
            r60 = r0
            goto L17e
        L171:
            r3 = 0
            r60 = r0
            r0 = 2
            androidx.compose.runtime.MutableState r3 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r14, r9, r0, r9)
            r7.updateRememberedValue(r3)
            r12 = r3
        L17e:
            r0 = r12
            androidx.compose.runtime.MutableState r0 = (androidx.compose.runtime.MutableState) r0
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r3 = BillingScreen$lambda$8(r17)
            java.lang.String r4 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r7 = BillingScreen$lambda$10(r19)
            r8 = -1793251385(0xffffffff951d27c7, float:-3.1737276E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r8, r10)
            java.lang.Enum r3 = (java.lang.Enum) r3
            int r3 = r3.ordinal()
            boolean r3 = r11.changed(r3)
            boolean r4 = r11.changed(r4)
            r3 = r3 | r4
            boolean r4 = r11.changed(r7)
            r3 = r3 | r4
            r4 = r11
            r7 = 0
            java.lang.Object r8 = r4.rememberedValue()
            r12 = 0
            if (r3 != 0) goto L1c0
            androidx.compose.runtime.Composer$Companion r13 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r13 = r13.getEmpty()
            if (r8 != r13) goto L1bd
            goto L1c0
        L1bd:
            r61 = r2
            goto L1cd
        L1c0:
            r13 = 0
            r61 = r2
            r2 = 2
            androidx.compose.runtime.MutableState r13 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r14, r9, r2, r9)
            r4.updateRememberedValue(r13)
            r8 = r13
        L1cd:
            r3 = r8
            androidx.compose.runtime.MutableState r3 = (androidx.compose.runtime.MutableState) r3
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r17)
            java.lang.String r4 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r7 = BillingScreen$lambda$10(r19)
            r8 = -1793248293(0xffffffff951d33db, float:-3.1746804E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r8, r10)
            java.lang.Enum r2 = (java.lang.Enum) r2
            int r2 = r2.ordinal()
            boolean r2 = r11.changed(r2)
            boolean r4 = r11.changed(r4)
            r2 = r2 | r4
            boolean r4 = r11.changed(r7)
            r2 = r2 | r4
            r4 = r11
            r7 = 0
            java.lang.Object r8 = r4.rememberedValue()
            r12 = 0
            if (r2 != 0) goto L20f
            androidx.compose.runtime.Composer$Companion r13 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r13 = r13.getEmpty()
            if (r8 != r13) goto L20c
            goto L20f
        L20c:
            r18 = r2
            goto L23a
        L20f:
            r13 = 0
            java.lang.String r9 = BillingScreen$lambda$9(r54)
            r18 = r2
            java.lang.String r2 = "DINEIN"
            boolean r2 = kotlin.jvm.internal.Intrinsics.areEqual(r9, r2)
            if (r2 == 0) goto L221
            java.lang.String r2 = "DINE-IN"
            goto L22e
        L221:
            java.lang.String r2 = "PREORDER"
            boolean r2 = kotlin.jvm.internal.Intrinsics.areEqual(r9, r2)
            if (r2 == 0) goto L22c
            java.lang.String r2 = "PRE-ORDER"
            goto L22e
        L22c:
            java.lang.String r2 = "TAKEAWAY"
        L22e:
            r6 = 0
            r9 = 2
            androidx.compose.runtime.MutableState r2 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r2, r6, r9, r6)
            r4.updateRememberedValue(r2)
            r8 = r2
        L23a:
            r4 = r8
            androidx.compose.runtime.MutableState r4 = (androidx.compose.runtime.MutableState) r4
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r17)
            java.lang.String r6 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r7 = BillingScreen$lambda$10(r19)
            r8 = -1793239669(0xffffffff951d558b, float:-3.177338E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r8, r10)
            java.lang.Enum r2 = (java.lang.Enum) r2
            int r2 = r2.ordinal()
            boolean r2 = r11.changed(r2)
            boolean r6 = r11.changed(r6)
            r2 = r2 | r6
            boolean r6 = r11.changed(r7)
            r2 = r2 | r6
            r6 = r11
            r7 = 0
            java.lang.Object r8 = r6.rememberedValue()
            r9 = 0
            if (r2 != 0) goto L27e
            androidx.compose.runtime.Composer$Companion r12 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r12 = r12.getEmpty()
            if (r8 != r12) goto L279
            goto L27e
        L279:
            r18 = r2
            r20 = r7
            goto L290
        L27e:
            r12 = 0
            java.lang.String r13 = "CASH"
            r18 = r2
            r20 = r7
            r2 = 2
            r7 = 0
            androidx.compose.runtime.MutableState r12 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r13, r7, r2, r7)
            r6.updateRememberedValue(r12)
            r8 = r12
        L290:
            r2 = r8
            androidx.compose.runtime.MutableState r2 = (androidx.compose.runtime.MutableState) r2
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r6 = BillingScreen$lambda$8(r17)
            java.lang.String r7 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r8 = BillingScreen$lambda$10(r19)
            r9 = -1793236505(0xffffffff951d61e7, float:-3.178313E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r9, r10)
            java.lang.Enum r6 = (java.lang.Enum) r6
            int r6 = r6.ordinal()
            boolean r6 = r11.changed(r6)
            boolean r7 = r11.changed(r7)
            r6 = r6 | r7
            boolean r7 = r11.changed(r8)
            r6 = r6 | r7
            r7 = r11
            r8 = 0
            java.lang.Object r9 = r7.rememberedValue()
            r12 = 0
            if (r6 != 0) goto L2d4
            androidx.compose.runtime.Composer$Companion r13 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r13 = r13.getEmpty()
            if (r9 != r13) goto L2cf
            goto L2d4
        L2cf:
            r18 = r6
            r20 = r8
            goto L2e4
        L2d4:
            r13 = 0
            r18 = r6
            r20 = r8
            r6 = 2
            r8 = 0
            androidx.compose.runtime.MutableState r13 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r14, r8, r6, r8)
            r7.updateRememberedValue(r13)
            r9 = r13
        L2e4:
            r6 = r9
            androidx.compose.runtime.MutableState r6 = (androidx.compose.runtime.MutableState) r6
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r7 = BillingScreen$lambda$8(r17)
            java.lang.String r8 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r9 = BillingScreen$lambda$10(r19)
            r12 = -1793233305(0xffffffff951d6e67, float:-3.179299E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r12, r10)
            java.lang.Enum r7 = (java.lang.Enum) r7
            int r7 = r7.ordinal()
            boolean r7 = r11.changed(r7)
            boolean r8 = r11.changed(r8)
            r7 = r7 | r8
            boolean r8 = r11.changed(r9)
            r7 = r7 | r8
            r8 = r11
            r9 = 0
            java.lang.Object r12 = r8.rememberedValue()
            r13 = 0
            if (r7 != 0) goto L328
            androidx.compose.runtime.Composer$Companion r18 = androidx.compose.runtime.Composer.INSTANCE
            r20 = r7
            java.lang.Object r7 = r18.getEmpty()
            if (r12 != r7) goto L325
            goto L32a
        L325:
            r21 = r9
            goto L33b
        L328:
            r20 = r7
        L32a:
            r7 = 0
            r18 = r7
            r21 = r9
            r7 = 2
            r9 = 0
            androidx.compose.runtime.MutableState r18 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r14, r9, r7, r9)
            r7 = r18
            r8.updateRememberedValue(r7)
            r12 = r7
        L33b:
            r7 = r12
            androidx.compose.runtime.MutableState r7 = (androidx.compose.runtime.MutableState) r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r8 = BillingScreen$lambda$8(r17)
            java.lang.String r9 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r12 = BillingScreen$lambda$10(r19)
            r13 = -1793230073(0xffffffff951d7b07, float:-3.180295E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r13, r10)
            java.lang.Enum r8 = (java.lang.Enum) r8
            int r8 = r8.ordinal()
            boolean r8 = r11.changed(r8)
            boolean r9 = r11.changed(r9)
            r8 = r8 | r9
            boolean r9 = r11.changed(r12)
            r8 = r8 | r9
            r9 = r11
            r12 = 0
            java.lang.Object r13 = r9.rememberedValue()
            r18 = 0
            if (r8 != 0) goto L380
            androidx.compose.runtime.Composer$Companion r20 = androidx.compose.runtime.Composer.INSTANCE
            r28 = r7
            java.lang.Object r7 = r20.getEmpty()
            if (r13 != r7) goto L37d
            goto L382
        L37d:
            r21 = r8
            goto L393
        L380:
            r28 = r7
        L382:
            r7 = 0
            r20 = r7
            r21 = r8
            r7 = 2
            r8 = 0
            androidx.compose.runtime.MutableState r20 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r14, r8, r7, r8)
            r7 = r20
            r9.updateRememberedValue(r7)
            r13 = r7
        L393:
            r7 = r13
            androidx.compose.runtime.MutableState r7 = (androidx.compose.runtime.MutableState) r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r8 = BillingScreen$lambda$8(r17)
            java.lang.String r9 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r12 = BillingScreen$lambda$10(r19)
            r13 = -1793226901(0xffffffff951d876b, float:-3.1812723E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r13, r10)
            java.lang.Enum r8 = (java.lang.Enum) r8
            int r8 = r8.ordinal()
            boolean r8 = r11.changed(r8)
            boolean r9 = r11.changed(r9)
            r8 = r8 | r9
            boolean r9 = r11.changed(r12)
            r8 = r8 | r9
            r9 = r11
            r12 = 0
            java.lang.Object r13 = r9.rememberedValue()
            r18 = 0
            r62 = r6
            if (r8 != 0) goto L3da
            androidx.compose.runtime.Composer$Companion r20 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r6 = r20.getEmpty()
            if (r13 != r6) goto L3d5
            goto L3da
        L3d5:
            r33 = r7
            r20 = r8
            goto L40c
        L3da:
            r6 = 0
            long r20 = java.lang.System.currentTimeMillis()
            r22 = r6
            java.lang.String r6 = java.lang.String.valueOf(r20)
            r33 = r7
            r7 = 6
            java.lang.String r6 = kotlin.text.StringsKt.takeLast(r6, r7)
            java.lang.StringBuilder r7 = new java.lang.StringBuilder
            r7.<init>()
            r20 = r8
            java.lang.String r8 = "PRE-"
            java.lang.StringBuilder r7 = r7.append(r8)
            java.lang.StringBuilder r6 = r7.append(r6)
            java.lang.String r6 = r6.toString()
            r7 = 2
            r8 = 0
            androidx.compose.runtime.MutableState r6 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r6, r8, r7, r8)
            r9.updateRememberedValue(r6)
            r13 = r6
        L40c:
            r6 = r13
            androidx.compose.runtime.MutableState r6 = (androidx.compose.runtime.MutableState) r6
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingFlowState r7 = BillingScreen$lambda$8(r17)
            java.lang.String r8 = BillingScreen$lambda$9(r54)
            com.example.sasloopmanager.data.TableItem r9 = BillingScreen$lambda$10(r19)
            r12 = -1793221657(0xffffffff951d9be7, float:-3.1828883E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r12, r10)
            java.lang.Enum r7 = (java.lang.Enum) r7
            int r7 = r7.ordinal()
            boolean r7 = r11.changed(r7)
            boolean r8 = r11.changed(r8)
            r7 = r7 | r8
            boolean r8 = r11.changed(r9)
            r7 = r7 | r8
            r8 = r11
            r9 = 0
            java.lang.Object r12 = r8.rememberedValue()
            r13 = 0
            if (r7 != 0) goto L451
            androidx.compose.runtime.Composer$Companion r18 = androidx.compose.runtime.Composer.INSTANCE
            r20 = r7
            java.lang.Object r7 = r18.getEmpty()
            if (r12 != r7) goto L44d
            goto L453
        L44d:
            r21 = r9
            r9 = 0
            goto L464
        L451:
            r20 = r7
        L453:
            r7 = 0
            r18 = r7
            r21 = r9
            r7 = 2
            r9 = 0
            androidx.compose.runtime.MutableState r18 = androidx.compose.runtime.SnapshotStateKt.mutableStateOf$default(r14, r9, r7, r9)
            r7 = r18
            r8.updateRememberedValue(r7)
            r12 = r7
        L464:
            r7 = r12
            androidx.compose.runtime.MutableState r7 = (androidx.compose.runtime.MutableState) r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.data.TableItem r8 = BillingScreen$lambda$10(r19)
            java.util.List r12 = BillingScreen$lambda$7(r16)
            r13 = -1793214878(0xffffffff951db662, float:-3.1849772E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r13, r10)
            r13 = r19
            boolean r18 = r11.changed(r13)
            r9 = r17
            boolean r17 = r11.changed(r9)
            r17 = r18 | r17
            r34 = r7
            r7 = r54
            boolean r18 = r11.changed(r7)
            r17 = r17 | r18
            r7 = r16
            boolean r16 = r11.changed(r7)
            r16 = r17 | r16
            boolean r17 = r11.changed(r0)
            r16 = r16 | r17
            boolean r17 = r11.changed(r3)
            r16 = r16 | r17
            boolean r17 = r11.changed(r2)
            r16 = r16 | r17
            boolean r17 = r11.changed(r4)
            r16 = r16 | r17
            r35 = r11
            r36 = r16
            r37 = 0
            r21 = r0
            java.lang.Object r0 = r35.rememberedValue()
            r38 = 0
            if (r36 != 0) goto L4d9
            androidx.compose.runtime.Composer$Companion r16 = androidx.compose.runtime.Composer.INSTANCE
            r23 = r2
            java.lang.Object r2 = r16.getEmpty()
            if (r0 != r2) goto L4cc
            goto L4db
        L4cc:
            r19 = r4
            r64 = r9
            r65 = r13
            r2 = r21
            r9 = r35
            r4 = r3
            r3 = r7
            goto L506
        L4d9:
            r23 = r2
        L4db:
            r2 = 0
            com.example.sasloopmanager.BillingScreenKt$BillingScreen$1$1 r16 = new com.example.sasloopmanager.BillingScreenKt$BillingScreen$1$1
            r25 = 0
            r22 = r3
            r24 = r4
            r20 = r7
            r18 = r9
            r17 = r13
            r19 = r54
            r16.<init>(r17, r18, r19, r20, r21, r22, r23, r24, r25)
            r7 = r2
            r65 = r17
            r64 = r18
            r3 = r20
            r2 = r21
            r4 = r22
            r19 = r24
            kotlin.jvm.functions.Function2 r16 = (kotlin.jvm.functions.Function2) r16
            r7 = r16
            r9 = r35
            r9.updateRememberedValue(r7)
            r0 = r7
        L506:
            kotlin.jvm.functions.Function2 r0 = (kotlin.jvm.functions.Function2) r0
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            r7 = 0
            androidx.compose.runtime.EffectsKt.LaunchedEffect(r8, r12, r0, r11, r7)
            java.util.List r0 = BillingScreen$lambda$0(r61)
            java.lang.Iterable r0 = (java.lang.Iterable) r0
            r7 = 0
            java.util.ArrayList r8 = new java.util.ArrayList
            r8.<init>()
            java.util.Collection r8 = (java.util.Collection) r8
            r9 = r0
            r12 = 0
            java.util.Iterator r13 = r9.iterator()
        L524:
            boolean r16 = r13.hasNext()
            if (r16 == 0) goto L5c1
            r16 = r0
            java.lang.Object r0 = r13.next()
            r17 = r0
            com.example.sasloopmanager.data.MenuItem r17 = (com.example.sasloopmanager.data.MenuItem) r17
            r18 = 0
            r66 = r3
            java.lang.String r3 = BillingScreen$lambda$2(r15)
            r20 = r7
            java.lang.String r7 = "ALL"
            boolean r3 = kotlin.jvm.internal.Intrinsics.areEqual(r3, r7)
            if (r3 != 0) goto L557
            java.lang.String r3 = r17.getCategory()
            java.lang.String r7 = BillingScreen$lambda$2(r15)
            boolean r3 = kotlin.jvm.internal.Intrinsics.areEqual(r3, r7)
            if (r3 == 0) goto L555
            goto L557
        L555:
            r3 = 0
            goto L558
        L557:
            r3 = 1
        L558:
            java.lang.String r7 = r17.getProductName()
            java.lang.CharSequence r7 = (java.lang.CharSequence) r7
            java.lang.String r21 = BillingScreen$lambda$3(r29)
            r22 = r9
            r9 = r21
            java.lang.CharSequence r9 = (java.lang.CharSequence) r9
            r21 = r12
            r12 = 1
            boolean r7 = kotlin.text.StringsKt.contains(r7, r9, r12)
            if (r7 != 0) goto L5a7
            java.lang.String r7 = r17.getDescription()
            if (r7 == 0) goto L587
            java.lang.CharSequence r7 = (java.lang.CharSequence) r7
            java.lang.String r9 = BillingScreen$lambda$3(r29)
            java.lang.CharSequence r9 = (java.lang.CharSequence) r9
            boolean r7 = kotlin.text.StringsKt.contains(r7, r9, r12)
            if (r7 != r12) goto L587
            r7 = 1
            goto L588
        L587:
            r7 = 0
        L588:
            if (r7 != 0) goto L5a7
            java.lang.String r7 = r17.getCode()
            if (r7 == 0) goto L5a1
            java.lang.CharSequence r7 = (java.lang.CharSequence) r7
            java.lang.String r9 = BillingScreen$lambda$3(r29)
            java.lang.CharSequence r9 = (java.lang.CharSequence) r9
            r12 = 1
            boolean r7 = kotlin.text.StringsKt.contains(r7, r9, r12)
            if (r7 != r12) goto L5a1
            r7 = 1
            goto L5a2
        L5a1:
            r7 = 0
        L5a2:
            if (r7 == 0) goto L5a5
            goto L5a7
        L5a5:
            r7 = 0
            goto L5a8
        L5a7:
            r7 = 1
        L5a8:
            if (r3 == 0) goto L5af
            if (r7 == 0) goto L5af
            r3 = 1
            goto L5b0
        L5af:
            r3 = 0
        L5b0:
            if (r3 == 0) goto L5b5
            r8.add(r0)
        L5b5:
            r0 = r16
            r7 = r20
            r12 = r21
            r9 = r22
            r3 = r66
            goto L524
        L5c1:
            r16 = r0
            r66 = r3
            r20 = r7
            r22 = r9
            r21 = r12
            r0 = r8
            java.util.List r0 = (java.util.List) r0
            java.lang.Boolean r3 = BillingScreen$lambda$13(r57)
            r58 = 1
            java.lang.Boolean r7 = java.lang.Boolean.valueOf(r58)
            boolean r3 = kotlin.jvm.internal.Intrinsics.areEqual(r3, r7)
            if (r3 == 0) goto L690
            r3 = 246151710(0xeabfa1e, float:4.239561E-30)
            r11.startReplaceGroup(r3)
            java.lang.String r3 = "111@5728L40,114@5977L300,110@5684L642"
            androidx.compose.runtime.ComposerKt.sourceInformation(r11, r3)
            r3 = r15
            long r15 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            r8 = -1793174134(0xffffffff951e558a, float:-3.1975324E-26)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r8, r10)
            boolean r8 = r11.changedInstance(r1)
            r9 = r11
            r12 = 0
            java.lang.Object r13 = r9.rememberedValue()
            r17 = 0
            if (r8 != 0) goto L610
            androidx.compose.runtime.Composer$Companion r18 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r7 = r18.getEmpty()
            if (r13 != r7) goto L60d
            goto L610
        L60d:
            r18 = r3
            goto L61d
        L610:
            r7 = 0
            r18 = r3
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda27 r3 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda27
            r3.<init>()
            r9.updateRememberedValue(r3)
            r13 = r3
        L61d:
            r7 = r13
            kotlin.jvm.functions.Function0 r7 = (kotlin.jvm.functions.Function0) r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda38 r3 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda38
            r3.<init>()
            r8 = -318595569(0xffffffffed029e0f, float:-2.5265083E27)
            r9 = 54
            r12 = 1
            androidx.compose.runtime.internal.ComposableLambda r3 = androidx.compose.runtime.internal.ComposableLambdaKt.rememberComposableLambda(r8, r12, r3, r11, r9)
            r8 = r3
            kotlin.jvm.functions.Function2 r8 = (kotlin.jvm.functions.Function2) r8
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r3 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r12 = r3.getLambda$657498643$app()
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r3 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r13 = r3.m8424getLambda$1245961452$app()
            r20 = r9
            r9 = 0
            r3 = r10
            r10 = 0
            r25 = r11
            r11 = 0
            r17 = r14
            r14 = 0
            r22 = r17
            r21 = r18
            r17 = 0
            r53 = r19
            r24 = r20
            r19 = 0
            r35 = r21
            r36 = r22
            r21 = 0
            r37 = r23
            r23 = 0
            r38 = r24
            r24 = 0
            r39 = r26
            r26 = 1769520(0x1b0030, float:2.479626E-39)
            r40 = 0
            r27 = 0
            r41 = r28
            r28 = 16028(0x3e9c, float:2.246E-41)
            r75 = r3
            r72 = r33
            r73 = r34
            r69 = r35
            r67 = r36
            r70 = r37
            r68 = r39
            r3 = r40
            r71 = r41
            androidx.compose.material3.AndroidAlertDialog_androidKt.m2063AlertDialogOix01E0(r7, r8, r9, r10, r11, r12, r13, r14, r15, r17, r19, r21, r23, r24, r25, r26, r27, r28)
            r7 = r25
            r7.endReplaceGroup()
            goto L6ad
        L690:
            r75 = r10
            r7 = r11
            r67 = r14
            r69 = r15
            r53 = r19
            r70 = r23
            r68 = r26
            r71 = r28
            r72 = r33
            r73 = r34
            r3 = 0
            r8 = 246774624(0xeb57b60, float:4.473875E-30)
            r7.startReplaceGroup(r8)
            r7.endReplaceGroup()
        L6ad:
            androidx.compose.ui.Modifier$Companion r8 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r8 = (androidx.compose.ui.Modifier) r8
            r9 = 0
            r12 = 1
            androidx.compose.ui.Modifier r13 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r8, r9, r12, r3)
            long r14 = com.example.sasloopmanager.theme.ColorKt.getBgDark()
            r17 = 2
            r18 = 0
            r16 = 0
            androidx.compose.ui.Modifier r8 = androidx.compose.foundation.BackgroundKt.m262backgroundbw27NRU$default(r13, r14, r16, r17, r18)
            r59 = 0
            r21 = r59
            r22 = r8
            r8 = r7
            r23 = 0
            r10 = 1042775818(0x3e277f0a, float:0.16357055)
            java.lang.String r11 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r10, r11)
            androidx.compose.ui.Alignment$Companion r11 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r11 = r11.getTopStart()
            r12 = 0
            androidx.compose.ui.layout.MeasurePolicy r24 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r11, r12)
            int r13 = r21 << 3
            r13 = r13 & 112(0x70, float:1.57E-43)
            r14 = r24
            r25 = r13
            r13 = r8
            r15 = r22
            r26 = 0
            r10 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            java.lang.String r3 = "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r10, r3)
            r10 = 0
            long r18 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r13, r10)
            int r28 = java.lang.Long.hashCode(r18)
            androidx.compose.runtime.CompositionLocalMap r10 = r13.getCurrentCompositionLocalMap()
            androidx.compose.ui.Modifier r9 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r13, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r19 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r19 = r19.getConstructor()
            r20 = r8
            int r8 = r25 << 6
            r8 = r8 & 896(0x380, float:1.256E-42)
            r63 = 6
            r8 = r8 | 6
            r76 = r8
            r8 = r19
            r77 = r13
            r78 = 0
            r19 = r11
            r11 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            r79 = r12
            java.lang.String r12 = "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp"
            r80 = r13
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r11, r12)
            androidx.compose.runtime.Applier r11 = r13.getApplier()
            boolean r11 = r11 instanceof androidx.compose.runtime.Applier
            if (r11 != 0) goto L739
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L739:
            r13.startReusableNode()
            boolean r11 = r13.getInserting()
            if (r11 == 0) goto L746
            r13.createNode(r8)
            goto L749
        L746:
            r13.useNode()
        L749:
            androidx.compose.runtime.Composer r11 = androidx.compose.runtime.Updater.m4364constructorimpl(r13)
            r33 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r81 = r8
            kotlin.jvm.functions.Function2 r8 = r34.getSetMeasurePolicy()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r14, r8)
            androidx.compose.ui.node.ComposeUiNode$Companion r8 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r8 = r8.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r10, r8)
            java.lang.Integer r8 = java.lang.Integer.valueOf(r28)
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r82 = r10
            kotlin.jvm.functions.Function2 r10 = r34.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r11, r8, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r8 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r8 = r8.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r11, r8)
            androidx.compose.ui.node.ComposeUiNode$Companion r8 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r8 = r8.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r9, r8)
            int r8 = r76 >> 6
            r83 = r8 & 14
            r8 = r13
            r84 = 0
            r10 = 1833054614(0x6d423196, float:3.7562524E27)
            java.lang.String r11 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r10, r11)
            androidx.compose.foundation.layout.BoxScopeInstance r10 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r11 = r21 >> 6
            r11 = r11 & 112(0x70, float:1.57E-43)
            r63 = 6
            r85 = r11 | 6
            r86 = r10
            androidx.compose.foundation.layout.BoxScope r86 = (androidx.compose.foundation.layout.BoxScope) r86
            r10 = r8
            r87 = 0
            r11 = -893522161(0xffffffffcabdef0f, float:-6223751.5)
            r88 = r8
            java.lang.String r8 = "C131@6446L57208:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r11, r8)
            androidx.compose.ui.Modifier$Companion r8 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r8 = (androidx.compose.ui.Modifier) r8
            r89 = r9
            r90 = r10
            r9 = 0
            r10 = 1
            r11 = 0
            androidx.compose.ui.Modifier r91 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r8, r11, r10, r9)
            r8 = 6
            r9 = r90
            r92 = r8
            r93 = 0
            r8 = 1341605231(0x4ff7456f, float:8.2970455E9)
            java.lang.String r10 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r8, r10)
            androidx.compose.foundation.layout.Arrangement r8 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r8 = r8.getTop()
            androidx.compose.ui.Alignment$Companion r10 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r10 = r10.getStart()
            int r11 = r92 >> 3
            r11 = r11 & 14
            int r33 = r92 >> 3
            r33 = r33 & 112(0x70, float:1.57E-43)
            r11 = r11 | r33
            androidx.compose.ui.layout.MeasurePolicy r94 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r8, r10, r9, r11)
            int r11 = r92 << 3
            r11 = r11 & 112(0x70, float:1.57E-43)
            r95 = r9
            r96 = r11
            r11 = r94
            r97 = r91
            r98 = 0
            r99 = r8
            r8 = r95
            r9 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r9, r3)
            r9 = 0
            long r33 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r8, r9)
            int r100 = java.lang.Long.hashCode(r33)
            androidx.compose.runtime.CompositionLocalMap r9 = r8.getCurrentCompositionLocalMap()
            r101 = r10
            r10 = r97
            r97 = r13
            androidx.compose.ui.Modifier r13 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r8, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r33 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r33 = r33.getConstructor()
            r102 = r8
            int r8 = r96 << 6
            r8 = r8 & 896(0x380, float:1.256E-42)
            r63 = 6
            r8 = r8 | 6
            r103 = r8
            r8 = r33
            r104 = r102
            r105 = 0
            r106 = r10
            r10 = r104
            r104 = r14
            r14 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r14, r12)
            androidx.compose.runtime.Applier r14 = r10.getApplier()
            boolean r14 = r14 instanceof androidx.compose.runtime.Applier
            if (r14 != 0) goto L847
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L847:
            r10.startReusableNode()
            boolean r14 = r10.getInserting()
            if (r14 == 0) goto L854
            r10.createNode(r8)
            goto L857
        L854:
            r10.useNode()
        L857:
            androidx.compose.runtime.Composer r14 = androidx.compose.runtime.Updater.m4364constructorimpl(r10)
            r33 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r107 = r8
            kotlin.jvm.functions.Function2 r8 = r34.getSetMeasurePolicy()
            androidx.compose.runtime.Updater.m4372setimpl(r14, r11, r8)
            androidx.compose.ui.node.ComposeUiNode$Companion r8 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r8 = r8.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r14, r9, r8)
            java.lang.Integer r8 = java.lang.Integer.valueOf(r100)
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r108 = r9
            kotlin.jvm.functions.Function2 r9 = r34.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r14, r8, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r8 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r8 = r8.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r14, r8)
            androidx.compose.ui.node.ComposeUiNode$Companion r8 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r8 = r8.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r14, r13, r8)
            int r8 = r103 >> 6
            r109 = r8 & 14
            r8 = r10
            r110 = 0
            r9 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            java.lang.String r14 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r9, r14)
            androidx.compose.foundation.layout.ColumnScopeInstance r9 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r14 = r92 >> 6
            r14 = r14 & 112(0x70, float:1.57E-43)
            r63 = 6
            r111 = r14 | 6
            r112 = r9
            androidx.compose.foundation.layout.ColumnScope r112 = (androidx.compose.foundation.layout.ColumnScope) r112
            r9 = r8
            r113 = 0
            r14 = -415764909(0xffffffffe737ee53, float:-8.685894E23)
            r114 = r8
            java.lang.String r8 = "C133@6578L3097,194@9689L41:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r14, r8)
            androidx.compose.ui.Modifier$Companion r8 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r8 = (androidx.compose.ui.Modifier) r8
            r37 = r9
            r115 = r10
            r9 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r38 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r8, r14, r10, r9)
            long r39 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            r42 = 2
            r43 = 0
            r41 = 0
            androidx.compose.ui.Modifier r8 = androidx.compose.foundation.BackgroundKt.m262backgroundbw27NRU$default(r38, r39, r41, r42, r43)
            r9 = 16
            r10 = 0
            float r14 = (float) r9
            float r9 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            r10 = 14
            r14 = 0
            r116 = r11
            float r11 = (float) r10
            float r10 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.ui.Modifier r8 = androidx.compose.foundation.layout.PaddingKt.m817paddingVpY3zN4(r8, r9, r10)
            androidx.compose.ui.Alignment$Companion r9 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r9 = r9.getCenterVertically()
            androidx.compose.foundation.layout.Arrangement r10 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r10 = r10.getSpaceBetween()
            androidx.compose.foundation.layout.Arrangement$Horizontal r10 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r10
            r11 = r37
            r14 = 432(0x1b0, float:6.05E-43)
            r33 = 0
            r34 = r8
            r8 = 844473419(0x3255a44b, float:1.2435588E-8)
            r117 = r13
            java.lang.String r13 = "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r8, r13)
            int r35 = r14 >> 3
            r35 = r35 & 14
            int r36 = r14 >> 3
            r36 = r36 & 112(0x70, float:1.57E-43)
            r8 = r35 | r36
            androidx.compose.ui.layout.MeasurePolicy r8 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r10, r9, r11, r8)
            int r35 = r14 << 3
            r35 = r35 & 112(0x70, float:1.57E-43)
            r36 = r8
            r38 = r34
            r39 = r11
            r40 = 0
            r41 = r8
            r8 = r39
            r39 = r9
            r9 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r9, r3)
            r9 = 0
            long r42 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r8, r9)
            int r9 = java.lang.Long.hashCode(r42)
            r42 = r9
            androidx.compose.runtime.CompositionLocalMap r9 = r8.getCurrentCompositionLocalMap()
            r43 = r10
            r10 = r38
            r38 = r11
            androidx.compose.ui.Modifier r11 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r8, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r44 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r44 = r44.getConstructor()
            r45 = r8
            int r8 = r35 << 6
            r8 = r8 & 896(0x380, float:1.256E-42)
            r63 = 6
            r8 = r8 | 6
            r46 = r45
            r47 = r44
            r44 = 0
            r48 = r10
            r119 = r15
            r10 = r46
            r15 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r15, r12)
            androidx.compose.runtime.Applier r15 = r10.getApplier()
            boolean r15 = r15 instanceof androidx.compose.runtime.Applier
            if (r15 != 0) goto L981
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L981:
            r10.startReusableNode()
            boolean r15 = r10.getInserting()
            if (r15 == 0) goto L990
            r15 = r47
            r10.createNode(r15)
            goto L995
        L990:
            r15 = r47
            r10.useNode()
        L995:
            r46 = r10
            androidx.compose.runtime.Composer r10 = androidx.compose.runtime.Updater.m4364constructorimpl(r46)
            r47 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r49 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r50 = r15
            kotlin.jvm.functions.Function2 r15 = r49.getSetMeasurePolicy()
            r120 = r6
            r6 = r36
            androidx.compose.runtime.Updater.m4372setimpl(r10, r6, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r15 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r15 = r15.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r10, r9, r15)
            java.lang.Integer r15 = java.lang.Integer.valueOf(r42)
            androidx.compose.ui.node.ComposeUiNode$Companion r36 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r49 = r6
            kotlin.jvm.functions.Function2 r6 = r36.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r10, r15, r6)
            androidx.compose.ui.node.ComposeUiNode$Companion r6 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r6 = r6.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r10, r6)
            androidx.compose.ui.node.ComposeUiNode$Companion r6 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r6 = r6.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r10, r11, r6)
            int r6 = r8 >> 6
            r6 = r6 & 14
            r10 = r46
            r15 = 0
            r36 = r6
            r6 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            r47 = r8
            java.lang.String r8 = "C101@5233L9:Row.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r6, r8)
            androidx.compose.foundation.layout.RowScopeInstance r51 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r52 = r14 >> 6
            r52 = r52 & 112(0x70, float:1.57E-43)
            r63 = 6
            r52 = r52 | 6
            androidx.compose.foundation.layout.RowScope r51 = (androidx.compose.foundation.layout.RowScope) r51
            r121 = r10
            r122 = 0
            r6 = 1384831122(0x528ad892, float:2.98169467E11)
            r124 = r9
            java.lang.String r9 = "C141@6926L2016,181@9000L661:BillingScreen.kt#7ez3px"
            r125 = r10
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r6, r9)
            androidx.compose.ui.Alignment$Companion r6 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r6 = r6.getCenterVertically()
            r9 = 384(0x180, float:5.38E-43)
            r126 = 0
            r127 = r10
            r121 = r11
            r11 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r11, r13)
            androidx.compose.ui.Modifier$Companion r11 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r11 = (androidx.compose.ui.Modifier) r11
            androidx.compose.foundation.layout.Arrangement r128 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r129 = r11
            androidx.compose.foundation.layout.Arrangement$Horizontal r11 = r128.getStart()
            int r128 = r9 >> 3
            r128 = r128 & 14
            int r130 = r9 >> 3
            r130 = r130 & 112(0x70, float:1.57E-43)
            r131 = r14
            r14 = r128 | r130
            androidx.compose.ui.layout.MeasurePolicy r14 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r11, r6, r10, r14)
            int r128 = r9 << 3
            r128 = r128 & 112(0x70, float:1.57E-43)
            r130 = r14
            r132 = r10
            r133 = r129
            r134 = 0
            r135 = r6
            r6 = r132
            r10 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r6, r10, r3)
            r10 = 0
            long r136 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r6, r10)
            int r10 = java.lang.Long.hashCode(r136)
            r136 = r10
            androidx.compose.runtime.CompositionLocalMap r10 = r6.getCurrentCompositionLocalMap()
            r137 = r11
            r11 = r133
            r133 = r14
            androidx.compose.ui.Modifier r14 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r6, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r138 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r138 = r138.getConstructor()
            r139 = r6
            int r6 = r128 << 6
            r6 = r6 & 896(0x380, float:1.256E-42)
            r63 = 6
            r6 = r6 | 6
            r140 = r139
            r141 = r138
            r138 = 0
            r142 = r11
            r11 = r140
            r140 = r15
            r15 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r15, r12)
            androidx.compose.runtime.Applier r15 = r11.getApplier()
            boolean r15 = r15 instanceof androidx.compose.runtime.Applier
            if (r15 != 0) goto La94
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        La94:
            r11.startReusableNode()
            boolean r15 = r11.getInserting()
            if (r15 == 0) goto Laa3
            r15 = r141
            r11.createNode(r15)
            goto Laa8
        Laa3:
            r15 = r141
            r11.useNode()
        Laa8:
            r141 = r11
            androidx.compose.runtime.Composer r11 = androidx.compose.runtime.Updater.m4364constructorimpl(r141)
            r143 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r144 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r145 = r15
            kotlin.jvm.functions.Function2 r15 = r144.getSetMeasurePolicy()
            r144 = r4
            r4 = r130
            androidx.compose.runtime.Updater.m4372setimpl(r11, r4, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r15 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r15 = r15.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r10, r15)
            java.lang.Integer r15 = java.lang.Integer.valueOf(r136)
            androidx.compose.ui.node.ComposeUiNode$Companion r130 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r146 = r4
            kotlin.jvm.functions.Function2 r4 = r130.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r11, r15, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r11, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r14, r4)
            int r4 = r6 >> 6
            r4 = r4 & 14
            r11 = r141
            r15 = 0
            r130 = r4
            r4 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r4, r8)
            androidx.compose.foundation.layout.RowScopeInstance r4 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r143 = r9 >> 6
            r143 = r143 & 112(0x70, float:1.57E-43)
            r63 = 6
            r143 = r143 | 6
            androidx.compose.foundation.layout.RowScope r4 = (androidx.compose.foundation.layout.RowScope) r4
            r154 = r11
            r157 = 0
            r158 = r4
            r4 = -1915475135(0xffffffff8dd42b41, float:-1.3075922E-30)
            r159 = r6
            java.lang.String r6 = "C151@7460L1464:BillingScreen.kt#7ez3px"
            r160 = r9
            r9 = r154
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r4, r6)
            com.example.sasloopmanager.BillingFlowState r4 = BillingScreen$lambda$8(r64)
            com.example.sasloopmanager.BillingFlowState r6 = com.example.sasloopmanager.BillingFlowState.SELECT_FLOW
            if (r4 == r6) goto Lbb7
            r4 = -1915476004(0xffffffff8dd427dc, float:-1.3075105E-30)
            r9.startReplaceGroup(r4)
            java.lang.String r4 = "144@7123L29,143@7073L280,149@7378L39"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r4)
            r4 = -1585808133(0xffffffffa17a7cfb, float:-8.4868705E-19)
            r6 = r75
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r4, r6)
            boolean r4 = r7.changedInstance(r1)
            r75 = r9
            r147 = 0
            r154 = r9
            java.lang.Object r9 = r75.rememberedValue()
            r148 = 0
            if (r4 != 0) goto Lb56
            androidx.compose.runtime.Composer$Companion r149 = androidx.compose.runtime.Composer.INSTANCE
            r150 = r4
            java.lang.Object r4 = r149.getEmpty()
            if (r9 != r4) goto Lb52
            goto Lb58
        Lb52:
            r4 = r9
            r9 = r75
            goto Lb69
        Lb56:
            r150 = r4
        Lb58:
            r4 = 0
            r149 = r4
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda49 r4 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda49
            r4.<init>()
            r149 = r9
            r9 = r75
            r9.updateRememberedValue(r4)
        Lb69:
            r147 = r4
            kotlin.jvm.functions.Function0 r147 = (kotlin.jvm.functions.Function0) r147
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r154)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r9 = 36
            r75 = 0
            r161 = r10
            float r10 = (float) r9
            float r9 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.ui.Modifier r148 = androidx.compose.foundation.layout.SizeKt.m862size3ABfNKs(r4, r9)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r4 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r153 = r4.getLambda$773734373$app()
            r149 = 0
            r150 = 0
            r151 = 0
            r152 = 0
            r155 = 1572912(0x180030, float:2.204119E-39)
            r156 = 60
            androidx.compose.material3.IconButtonKt.IconButton(r147, r148, r149, r150, r151, r152, r153, r154, r155, r156)
            r9 = r154
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r10 = 8
            r75 = 0
            r147 = r11
            float r11 = (float) r10
            float r10 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.SizeKt.m867width3ABfNKs(r4, r10)
            r10 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r4, r9, r10)
            r9.endReplaceGroup()
            goto Lbc6
        Lbb7:
            r161 = r10
            r147 = r11
            r6 = r75
            r4 = -1915099292(0xffffffff8dd9e764, float:-1.3429363E-30)
            r9.startReplaceGroup(r4)
            r9.endReplaceGroup()
        Lbc6:
            r59 = 0
            r4 = r59
            r10 = r9
            r11 = 0
            r154 = r9
            r9 = 1341605231(0x4ff7456f, float:8.2970455E9)
            r75 = r11
            java.lang.String r11 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r9, r11)
            androidx.compose.ui.Modifier$Companion r9 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r9 = (androidx.compose.ui.Modifier) r9
            androidx.compose.foundation.layout.Arrangement r11 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r11 = r11.getTop()
            androidx.compose.ui.Alignment$Companion r148 = androidx.compose.ui.Alignment.INSTANCE
            r149 = r9
            androidx.compose.ui.Alignment$Horizontal r9 = r148.getStart()
            int r148 = r4 >> 3
            r148 = r148 & 14
            int r150 = r4 >> 3
            r150 = r150 & 112(0x70, float:1.57E-43)
            r151 = r14
            r14 = r148 | r150
            androidx.compose.ui.layout.MeasurePolicy r14 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r11, r9, r10, r14)
            int r148 = r4 << 3
            r148 = r148 & 112(0x70, float:1.57E-43)
            r150 = r149
            r152 = r10
            r153 = r14
            r155 = 0
            r156 = r9
            r9 = r152
            r10 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r10, r3)
            r10 = 0
            long r162 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r9, r10)
            int r10 = java.lang.Long.hashCode(r162)
            r162 = r10
            androidx.compose.runtime.CompositionLocalMap r10 = r9.getCurrentCompositionLocalMap()
            r163 = r11
            r11 = r150
            r150 = r14
            androidx.compose.ui.Modifier r14 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r9, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r164 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r164 = r164.getConstructor()
            r165 = r9
            int r9 = r148 << 6
            r9 = r9 & 896(0x380, float:1.256E-42)
            r63 = 6
            r9 = r9 | 6
            r166 = r164
            r164 = r165
            r167 = 0
            r168 = r11
            r11 = r164
            r164 = r15
            r15 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r15, r12)
            androidx.compose.runtime.Applier r15 = r11.getApplier()
            boolean r15 = r15 instanceof androidx.compose.runtime.Applier
            if (r15 != 0) goto Lc59
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        Lc59:
            r11.startReusableNode()
            boolean r15 = r11.getInserting()
            if (r15 == 0) goto Lc68
            r15 = r166
            r11.createNode(r15)
            goto Lc6d
        Lc68:
            r15 = r166
            r11.useNode()
        Lc6d:
            r166 = r11
            androidx.compose.runtime.Composer r11 = androidx.compose.runtime.Updater.m4364constructorimpl(r166)
            r169 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r170 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r171 = r15
            kotlin.jvm.functions.Function2 r15 = r170.getSetMeasurePolicy()
            r170 = r2
            r2 = r153
            androidx.compose.runtime.Updater.m4372setimpl(r11, r2, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r15 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r15 = r15.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r10, r15)
            java.lang.Integer r15 = java.lang.Integer.valueOf(r162)
            androidx.compose.ui.node.ComposeUiNode$Companion r153 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r172 = r2
            kotlin.jvm.functions.Function2 r2 = r153.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r11, r15, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r2 = r2.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r11, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r2 = r2.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r14, r2)
            int r2 = r9 >> 6
            r2 = r2 & 14
            r11 = r166
            r15 = 0
            r153 = r2
            r2 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            r169 = r9
            java.lang.String r9 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r2, r9)
            androidx.compose.foundation.layout.ColumnScopeInstance r2 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r9 = r4 >> 6
            r9 = r9 & 112(0x70, float:1.57E-43)
            r63 = 6
            r9 = r9 | 6
            androidx.compose.foundation.layout.ColumnScope r2 = (androidx.compose.foundation.layout.ColumnScope) r2
            r195 = r11
            r199 = 0
            r200 = r2
            r2 = -926430502(0xffffffffc8c7cada, float:-409174.8)
            r201 = r4
            java.lang.String r4 = "C152@7493L1002:BillingScreen.kt#7ez3px"
            r202 = r9
            r9 = r195
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r4)
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r64)
            int[] r4 = com.example.sasloopmanager.BillingScreenKt.WhenMappings.$EnumSwitchMapping$0
            int r2 = r2.ordinal()
            r2 = r4[r2]
            switch(r2) {
                case 1: goto Ld76;
                case 2: goto Ld6f;
                case 3: goto Lcfa;
                default: goto Lcf2;
            }
        Lcf2:
            r67 = r0
            kotlin.NoWhenBranchMatchedException r0 = new kotlin.NoWhenBranchMatchedException
            r0.<init>()
            throw r0
        Lcfa:
            java.lang.String r2 = BillingScreen$lambda$9(r54)
            int r4 = r2.hashCode()
            switch(r4) {
                case -2101199047: goto Ld5a;
                case -497356149: goto Ld4a;
                case 1060336894: goto Ld3a;
                case 2016591649: goto Ld09;
                default: goto Ld05;
            }
        Ld05:
            r195 = r9
            goto Ld6a
        Ld09:
            java.lang.String r4 = "DINEIN"
            boolean r2 = r2.equals(r4)
            if (r2 != 0) goto Ld14
            r195 = r9
            goto Ld6a
        Ld14:
            com.example.sasloopmanager.data.TableItem r2 = BillingScreen$lambda$10(r65)
            if (r2 == 0) goto Ld20
            java.lang.String r2 = r2.getTableName()
            if (r2 != 0) goto Ld22
        Ld20:
            java.lang.String r2 = "Unknown"
        Ld22:
            java.lang.StringBuilder r4 = new java.lang.StringBuilder
            r4.<init>()
            r195 = r9
            java.lang.String r9 = "Table: "
            java.lang.StringBuilder r4 = r4.append(r9)
            java.lang.StringBuilder r2 = r4.append(r2)
            java.lang.String r2 = r2.toString()
            r173 = r2
            goto Ld7c
        Ld3a:
            r195 = r9
            java.lang.String r4 = "TAKEAWAY_DELIVERY"
            boolean r2 = r2.equals(r4)
            if (r2 != 0) goto Ld45
            goto Ld64
        Ld45:
            java.lang.String r2 = "Takeaway / Delivery"
            r173 = r2
            goto Ld7c
        Ld4a:
            r195 = r9
            java.lang.String r4 = "PREORDER"
            boolean r2 = r2.equals(r4)
            if (r2 != 0) goto Ld55
            goto Ld64
        Ld55:
            java.lang.String r2 = "Pre-Order"
            r173 = r2
            goto Ld7c
        Ld5a:
            r195 = r9
            java.lang.String r4 = "QUICK_BILL"
            boolean r2 = r2.equals(r4)
            if (r2 != 0) goto Ld65
        Ld64:
            goto Ld6a
        Ld65:
            java.lang.String r2 = "Quick Bill"
            r173 = r2
            goto Ld7c
        Ld6a:
            java.lang.String r2 = "POS Billing"
            r173 = r2
            goto Ld7c
        Ld6f:
            r195 = r9
            java.lang.String r2 = "Select Table"
            r173 = r2
            goto Ld7c
        Ld76:
            r195 = r9
            java.lang.String r2 = "POS Billing"
            r173 = r2
        Ld7c:
            androidx.compose.ui.graphics.Color$Companion r2 = androidx.compose.ui.graphics.Color.INSTANCE
            long r175 = r2.m5131getWhite0d7_KjU()
            r2 = 18
            long r178 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r181 = r2.getBlack()
            r174 = 0
            r177 = 0
            r180 = 0
            r182 = 0
            r183 = 0
            r185 = 0
            r186 = 0
            r187 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r193 = 0
            r194 = 0
            r196 = 1597824(0x186180, float:2.239028E-39)
            r197 = 0
            r198 = 262058(0x3ffaa, float:3.67221E-40)
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r173, r174, r175, r177, r178, r180, r181, r182, r183, r185, r186, r187, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            r9 = r195
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r64)
            com.example.sasloopmanager.BillingFlowState r4 = com.example.sasloopmanager.BillingFlowState.ORDERING
            if (r2 != r4) goto Le2f
            java.lang.String r2 = BillingScreen$lambda$9(r54)
            java.lang.String r4 = "DINEIN"
            boolean r2 = kotlin.jvm.internal.Intrinsics.areEqual(r2, r4)
            if (r2 == 0) goto Le2f
            com.example.sasloopmanager.data.TableItem r2 = BillingScreen$lambda$10(r65)
            if (r2 == 0) goto Ldd7
            java.lang.String r2 = r2.getDepartmentName()
            goto Ldd8
        Ldd7:
            r2 = 0
        Ldd8:
            if (r2 == 0) goto Le2f
            r2 = -925336885(0xffffffffc8d87acb, float:-443350.34)
            r9.startReplaceGroup(r2)
            java.lang.String r2 = "171@8661L215"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r2)
            com.example.sasloopmanager.data.TableItem r2 = BillingScreen$lambda$10(r65)
            if (r2 == 0) goto Ldf5
            java.lang.String r2 = r2.getDepartmentName()
            if (r2 != 0) goto Ldf2
            goto Ldf5
        Ldf2:
            r173 = r2
            goto Ldf7
        Ldf5:
            r173 = r67
        Ldf7:
            long r175 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r2 = 11
            long r178 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            r174 = 0
            r177 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r185 = 0
            r186 = 0
            r187 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r193 = 0
            r194 = 0
            r196 = 24576(0x6000, float:3.4438E-41)
            r197 = 0
            r198 = 262122(0x3ffea, float:3.67311E-40)
            r195 = r9
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r173, r174, r175, r177, r178, r180, r181, r182, r183, r185, r186, r187, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            r9.endReplaceGroup()
            goto Le38
        Le2f:
            r2 = -925076454(0xffffffffc8dc741a, float:-451488.8)
            r9.startReplaceGroup(r2)
            r9.endReplaceGroup()
        Le38:
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r9)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r11)
            r166.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r166)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r165)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r152)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r154)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r147)
            r141.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r141)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r139)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r132)
            androidx.compose.ui.Alignment$Companion r2 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r2 = r2.getCenterVertically()
            r4 = 384(0x180, float:5.38E-43)
            r9 = r127
            r10 = 0
            r11 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r11, r13)
            androidx.compose.ui.Modifier$Companion r11 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r11 = (androidx.compose.ui.Modifier) r11
            androidx.compose.foundation.layout.Arrangement r14 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Horizontal r14 = r14.getStart()
            int r15 = r4 >> 3
            r15 = r15 & 14
            int r75 = r4 >> 3
            r75 = r75 & 112(0x70, float:1.57E-43)
            r15 = r15 | r75
            androidx.compose.ui.layout.MeasurePolicy r15 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r14, r2, r9, r15)
            int r75 = r4 << 3
            r75 = r75 & 112(0x70, float:1.57E-43)
            r126 = r15
            r128 = r9
            r129 = r11
            r130 = 0
            r132 = r2
            r2 = r128
            r9 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r9, r3)
            r9 = 0
            long r133 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r9)
            int r9 = java.lang.Long.hashCode(r133)
            r133 = r9
            androidx.compose.runtime.CompositionLocalMap r9 = r2.getCurrentCompositionLocalMap()
            r134 = r10
            r10 = r129
            androidx.compose.ui.Modifier r11 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r135 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r135 = r135.getConstructor()
            r136 = r2
            int r2 = r75 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r137 = r136
            r138 = r135
            r135 = 0
            r139 = r10
            r10 = r137
            r137 = r14
            r14 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r14, r12)
            androidx.compose.runtime.Applier r14 = r10.getApplier()
            boolean r14 = r14 instanceof androidx.compose.runtime.Applier
            if (r14 != 0) goto Leea
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        Leea:
            r10.startReusableNode()
            boolean r14 = r10.getInserting()
            if (r14 == 0) goto Lef9
            r14 = r138
            r10.createNode(r14)
            goto Lefe
        Lef9:
            r14 = r138
            r10.useNode()
        Lefe:
            r138 = r10
            androidx.compose.runtime.Composer r10 = androidx.compose.runtime.Updater.m4364constructorimpl(r138)
            r141 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r142 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r143 = r14
            kotlin.jvm.functions.Function2 r14 = r142.getSetMeasurePolicy()
            r142 = r15
            r15 = r126
            androidx.compose.runtime.Updater.m4372setimpl(r10, r15, r14)
            androidx.compose.ui.node.ComposeUiNode$Companion r14 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r14 = r14.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r10, r9, r14)
            java.lang.Integer r14 = java.lang.Integer.valueOf(r133)
            androidx.compose.ui.node.ComposeUiNode$Companion r126 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r145 = r9
            kotlin.jvm.functions.Function2 r9 = r126.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r10, r14, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r9 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r9 = r9.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r10, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r9 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r9 = r9.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r10, r11, r9)
            int r9 = r2 >> 6
            r9 = r9 & 14
            r10 = r138
            r14 = 0
            r126 = r2
            r2 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r2, r8)
            androidx.compose.foundation.layout.RowScopeInstance r2 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r141 = r4 >> 6
            r141 = r141 & 112(0x70, float:1.57E-43)
            r63 = 6
            r141 = r141 | 6
            androidx.compose.foundation.layout.RowScope r2 = (androidx.compose.foundation.layout.RowScope) r2
            r153 = r10
            r156 = 0
            r157 = r2
            r2 = -1885443165(0xffffffff8f9e6ba3, float:-1.5621463E-29)
            r158 = r4
            java.lang.String r4 = "C:BillingScreen.kt#7ez3px"
            r159 = r9
            r9 = r153
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r4)
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r64)
            com.example.sasloopmanager.BillingFlowState r4 = com.example.sasloopmanager.BillingFlowState.SELECT_TABLE
            if (r2 != r4) goto Lfdb
            r2 = -1885406028(0xffffffff8f9efcb4, float:-1.567734E-29)
            r9.startReplaceGroup(r2)
            java.lang.String r2 = "183@9169L49,183@9148L183"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r2)
            r2 = -753554888(0xffffffffd315aa38, float:-6.4280592E11)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r6)
            boolean r2 = r7.changedInstance(r1)
            r4 = r9
            r146 = 0
            r153 = r9
            java.lang.Object r9 = r4.rememberedValue()
            r147 = 0
            if (r2 != 0) goto Lfa6
            androidx.compose.runtime.Composer$Companion r148 = androidx.compose.runtime.Composer.INSTANCE
            r149 = r2
            java.lang.Object r2 = r148.getEmpty()
            if (r9 != r2) goto Lfa5
            goto Lfa8
        Lfa5:
            goto Lfb5
        Lfa6:
            r149 = r2
        Lfa8:
            r2 = 0
            r148 = r2
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda52 r2 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda52
            r2.<init>()
            r4.updateRememberedValue(r2)
            r9 = r2
        Lfb5:
            r146 = r9
            kotlin.jvm.functions.Function0 r146 = (kotlin.jvm.functions.Function0) r146
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r2 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r152 = r2.m8429getLambda$187254514$app()
            r154 = 1572864(0x180000, float:2.204052E-39)
            r155 = 62
            r147 = 0
            r148 = 0
            r149 = 0
            r150 = 0
            r151 = 0
            androidx.compose.material3.IconButtonKt.IconButton(r146, r147, r148, r149, r150, r151, r152, r153, r154, r155)
            r9 = r153
            r9.endReplaceGroup()
            goto L1058
        Lfdb:
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r64)
            com.example.sasloopmanager.BillingFlowState r4 = com.example.sasloopmanager.BillingFlowState.ORDERING
            if (r2 != r4) goto L104f
            java.util.Map r2 = BillingScreen$lambda$4(r287)
            boolean r2 = r2.isEmpty()
            if (r2 != 0) goto L104f
            r2 = -1885106816(0xffffffff8fa38d80, float:-1.6127545E-29)
            r9.startReplaceGroup(r2)
            java.lang.String r2 = "187@9471L32,187@9450L171"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r2)
            r2 = -753545241(0xffffffffd315cfe7, float:-6.4343815E11)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r6)
            boolean r2 = r7.changedInstance(r1)
            r4 = r9
            r146 = 0
            r153 = r9
            java.lang.Object r9 = r4.rememberedValue()
            r147 = 0
            if (r2 != 0) goto L101b
            androidx.compose.runtime.Composer$Companion r148 = androidx.compose.runtime.Composer.INSTANCE
            r149 = r2
            java.lang.Object r2 = r148.getEmpty()
            if (r9 != r2) goto L101a
            goto L101d
        L101a:
            goto L102a
        L101b:
            r149 = r2
        L101d:
            r2 = 0
            r148 = r2
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda53 r2 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda53
            r2.<init>()
            r4.updateRememberedValue(r2)
            r9 = r2
        L102a:
            r146 = r9
            kotlin.jvm.functions.Function0 r146 = (kotlin.jvm.functions.Function0) r146
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r2 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r152 = r2.getLambda$105956165$app()
            r154 = 1572864(0x180000, float:2.204052E-39)
            r155 = 62
            r147 = 0
            r148 = 0
            r149 = 0
            r150 = 0
            r151 = 0
            androidx.compose.material3.IconButtonKt.IconButton(r146, r147, r148, r149, r150, r151, r152, r153, r154, r155)
            r9 = r153
            r9.endReplaceGroup()
            goto L1058
        L104f:
            r2 = -1884896357(0xffffffff8fa6c39b, float:-1.6444208E-29)
            r9.startReplaceGroup(r2)
            r9.endReplaceGroup()
        L1058:
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r9)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r10)
            r138.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r138)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r136)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r128)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r127)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r125)
            r46.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r46)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r45)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r38)
            long r35 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            r38 = 0
            r39 = 3
            r33 = 0
            r34 = 0
            androidx.compose.material3.DividerKt.m2396HorizontalDivider9IZ8Weo(r33, r34, r35, r37, r38, r39)
            r9 = r37
            com.example.sasloopmanager.BillingFlowState r2 = BillingScreen$lambda$8(r64)
            int[] r4 = com.example.sasloopmanager.BillingScreenKt.WhenMappings.$EnumSwitchMapping$0
            int r2 = r2.ordinal()
            r2 = r4[r2]
            switch(r2) {
                case 1: goto L42b3;
                case 2: goto L4045;
                case 3: goto L10bd;
                default: goto L10a6;
            }
        L10a6:
            r67 = r0
            r271 = r144
            r144 = r5
            r5 = r9
            r0 = -706047930(0xffffffffd5ea9046, float:-3.22381713E13)
            r5.startReplaceGroup(r0)
            r5.endReplaceGroup()
            kotlin.NoWhenBranchMatchedException r0 = new kotlin.NoWhenBranchMatchedException
            r0.<init>()
            throw r0
        L10bd:
            r2 = -407154784(0xffffffffe7bb4fa0, float:-1.7691027E24)
            r9.startReplaceGroup(r2)
            java.lang.String r2 = "303@15560L48052"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r2)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r75 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r2, r14, r10, r4)
            r121 = 6
            r10 = r9
            r122 = 0
            r2 = 1341605231(0x4ff7456f, float:8.2970455E9)
            java.lang.String r4 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r2, r4)
            androidx.compose.foundation.layout.Arrangement r2 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r11 = r2.getTop()
            androidx.compose.ui.Alignment$Companion r2 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r14 = r2.getStart()
            int r2 = r121 >> 3
            r2 = r2 & 14
            int r4 = r121 >> 3
            r4 = r4 & 112(0x70, float:1.57E-43)
            r2 = r2 | r4
            androidx.compose.ui.layout.MeasurePolicy r124 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r11, r14, r10, r2)
            int r2 = r121 << 3
            r2 = r2 & 112(0x70, float:1.57E-43)
            r15 = r10
            r4 = r124
            r125 = r75
            r126 = r2
            r127 = 0
            r2 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r15, r2, r3)
            r2 = 0
            long r33 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r15, r2)
            int r128 = java.lang.Long.hashCode(r33)
            androidx.compose.runtime.CompositionLocalMap r2 = r15.getCurrentCompositionLocalMap()
            r129 = r9
            r9 = r125
            r125 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r15, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r33 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r33 = r33.getConstructor()
            r130 = r9
            int r9 = r126 << 6
            r9 = r9 & 896(0x380, float:1.256E-42)
            r63 = 6
            r9 = r9 | 6
            r131 = r33
            r132 = r9
            r9 = r15
            r133 = 0
            r134 = r11
            r11 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r11, r12)
            androidx.compose.runtime.Applier r11 = r9.getApplier()
            boolean r11 = r11 instanceof androidx.compose.runtime.Applier
            if (r11 != 0) goto L114e
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L114e:
            r9.startReusableNode()
            boolean r11 = r9.getInserting()
            if (r11 == 0) goto L115d
            r11 = r131
            r9.createNode(r11)
            goto L1162
        L115d:
            r11 = r131
            r9.useNode()
        L1162:
            r131 = r9
            androidx.compose.runtime.Composer r9 = androidx.compose.runtime.Updater.m4364constructorimpl(r131)
            r33 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r135 = r11
            kotlin.jvm.functions.Function2 r11 = r34.getSetMeasurePolicy()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r4, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r11 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r11 = r11.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r2, r11)
            java.lang.Integer r11 = java.lang.Integer.valueOf(r128)
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r136 = r2
            kotlin.jvm.functions.Function2 r2 = r34.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r9, r11, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r2 = r2.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r9, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r2 = r2.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r10, r2)
            int r2 = r132 >> 6
            r137 = r2 & 14
            r2 = r131
            r9 = r2
            r138 = 0
            r2 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            java.lang.String r11 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r11)
            androidx.compose.foundation.layout.ColumnScopeInstance r2 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r11 = r121 >> 6
            r11 = r11 & 112(0x70, float:1.57E-43)
            r63 = 6
            r139 = r11 | 6
            r33 = r2
            androidx.compose.foundation.layout.ColumnScope r33 = (androidx.compose.foundation.layout.ColumnScope) r33
            r2 = r9
            r140 = 0
            r11 = -1613638746(0xffffffff9fd1d3a6, float:-8.8865086E-20)
            r141 = r4
            java.lang.String r4 = "C310@15995L2611,305@15705L2901,356@18632L41:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r11, r4)
            java.lang.String r4 = BillingScreen$lambda$15(r5)
            java.lang.String r11 = "MENU"
            boolean r4 = kotlin.jvm.internal.Intrinsics.areEqual(r4, r11)
            r11 = 1
            r34 = r4 ^ 1
            long r36 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            long r38 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r142 = r9
            r143 = r10
            r9 = 0
            r10 = 0
            androidx.compose.ui.Modifier r35 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r4, r9, r11, r10)
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda28 r4 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda28
            r9 = r287
            r4.<init>()
            r10 = -1888427144(0xffffffff8f70e378, float:-1.18767225E-29)
            r287 = r14
            r14 = 54
            androidx.compose.runtime.internal.ComposableLambda r4 = androidx.compose.runtime.internal.ComposableLambdaKt.rememberComposableLambda(r10, r11, r4, r2, r14)
            r42 = r4
            kotlin.jvm.functions.Function2 r42 = (kotlin.jvm.functions.Function2) r42
            r40 = 0
            r41 = 0
            r44 = 1572912(0x180030, float:2.204119E-39)
            r45 = 48
            r43 = r2
            androidx.compose.material3.TabRowKt.m2980TabRowpAZo6Ak(r34, r35, r36, r38, r40, r41, r42, r43, r44, r45)
            long r36 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            r39 = 0
            r40 = 3
            r34 = 0
            r35 = 0
            r38 = r43
            androidx.compose.material3.DividerKt.m2396HorizontalDivider9IZ8Weo(r34, r35, r36, r38, r39, r40)
            r2 = r38
            java.lang.String r4 = BillingScreen$lambda$15(r5)
            java.lang.String r10 = "MENU"
            boolean r4 = kotlin.jvm.internal.Intrinsics.areEqual(r4, r10)
            if (r4 == 0) goto L1f29
            r4 = -1611744709(0xffffffff9feeba3b, float:-1.0110501E-19)
            r2.startReplaceGroup(r4)
            java.lang.String r4 = "360@18813L8279"
            androidx.compose.runtime.ComposerKt.sourceInformation(r2, r4)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            r34 = r4
            androidx.compose.ui.Modifier r34 = (androidx.compose.ui.Modifier) r34
            r37 = 2
            r38 = 0
            r35 = 1065353216(0x3f800000, float:1.0)
            r36 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.ColumnScope.weight$default(r33, r34, r35, r36, r37, r38)
            r8 = 0
            r10 = r2
            r11 = 0
            r13 = 1341605231(0x4ff7456f, float:8.2970455E9)
            java.lang.String r14 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r13, r14)
            androidx.compose.foundation.layout.Arrangement r13 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r13 = r13.getTop()
            androidx.compose.ui.Alignment$Companion r14 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r14 = r14.getStart()
            int r34 = r8 >> 3
            r34 = r34 & 14
            int r35 = r8 >> 3
            r35 = r35 & 112(0x70, float:1.57E-43)
            r36 = r4
            r4 = r34 | r35
            androidx.compose.ui.layout.MeasurePolicy r4 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r13, r14, r10, r4)
            int r34 = r8 << 3
            r34 = r34 & 112(0x70, float:1.57E-43)
            r35 = r4
            r37 = r36
            r38 = r10
            r39 = 0
            r40 = r4
            r4 = r38
            r10 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r10, r3)
            r10 = 0
            long r41 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r10)
            int r10 = java.lang.Long.hashCode(r41)
            r41 = r10
            androidx.compose.runtime.CompositionLocalMap r10 = r4.getCurrentCompositionLocalMap()
            r42 = r11
            r11 = r37
            r37 = r13
            androidx.compose.ui.Modifier r13 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r43 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r43 = r43.getConstructor()
            r44 = r4
            int r4 = r34 << 6
            r4 = r4 & 896(0x380, float:1.256E-42)
            r63 = 6
            r4 = r4 | 6
            r45 = r43
            r43 = r44
            r46 = 0
            r47 = r11
            r11 = r43
            r43 = r14
            r14 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r14, r12)
            androidx.compose.runtime.Applier r14 = r11.getApplier()
            boolean r14 = r14 instanceof androidx.compose.runtime.Applier
            if (r14 != 0) goto L12da
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L12da:
            r11.startReusableNode()
            boolean r14 = r11.getInserting()
            if (r14 == 0) goto L12e9
            r14 = r45
            r11.createNode(r14)
            goto L12ee
        L12e9:
            r14 = r45
            r11.useNode()
        L12ee:
            r45 = r11
            androidx.compose.runtime.Composer r11 = androidx.compose.runtime.Updater.m4364constructorimpl(r45)
            r48 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r49 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r50 = r14
            kotlin.jvm.functions.Function2 r14 = r49.getSetMeasurePolicy()
            r145 = r15
            r15 = r35
            androidx.compose.runtime.Updater.m4372setimpl(r11, r15, r14)
            androidx.compose.ui.node.ComposeUiNode$Companion r14 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r14 = r14.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r10, r14)
            java.lang.Integer r14 = java.lang.Integer.valueOf(r41)
            androidx.compose.ui.node.ComposeUiNode$Companion r35 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r49 = r10
            kotlin.jvm.functions.Function2 r10 = r35.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r11, r14, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r10 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r10 = r10.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r11, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r10 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r10 = r10.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r13, r10)
            int r10 = r4 >> 6
            r10 = r10 & 14
            r11 = r45
            r14 = 0
            r35 = r4
            r4 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            r48 = r10
            java.lang.String r10 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r4, r10)
            androidx.compose.foundation.layout.ColumnScopeInstance r4 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r10 = r8 >> 6
            r10 = r10 & 112(0x70, float:1.57E-43)
            r63 = 6
            r10 = r10 | 6
            androidx.compose.foundation.layout.ColumnScope r4 = (androidx.compose.foundation.layout.ColumnScope) r4
            r156 = r11
            r51 = 0
            r52 = r4
            r4 = -1110385662(0xffffffffbdd0dc02, float:-0.10198213)
            r67 = r8
            java.lang.String r8 = "C362@18932L1670,394@21077L2809,388@20686L3200,435@23920L41:BillingScreen.kt#7ez3px"
            r118 = r10
            r10 = r156
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r4, r8)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r123 = r11
            r161 = r13
            r8 = 0
            r11 = 0
            r13 = 1
            androidx.compose.ui.Modifier r146 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r4, r8, r13, r11)
            long r147 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            r150 = 2
            r151 = 0
            r149 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.BackgroundKt.m262backgroundbw27NRU$default(r146, r147, r149, r150, r151)
            r8 = 16
            r11 = 0
            float r13 = (float) r8
            float r8 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r13)
            r11 = 10
            r13 = 0
            r146 = r13
            float r13 = (float) r11
            float r11 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r13)
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.PaddingKt.m817paddingVpY3zN4(r4, r8, r11)
            r59 = 0
            r8 = r59
            r11 = r10
            r13 = 0
            r146 = r4
            java.lang.String r4 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r147 = r13
            r13 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r13, r4)
            androidx.compose.ui.Alignment$Companion r4 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r4 = r4.getTopStart()
            r13 = 0
            androidx.compose.ui.layout.MeasurePolicy r148 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r4, r13)
            int r149 = r8 << 3
            r149 = r149 & 112(0x70, float:1.57E-43)
            r150 = r148
            r151 = r11
            r152 = r146
            r153 = 0
            r154 = r4
            r4 = r151
            r11 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r11, r3)
            r11 = 0
            long r155 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r11)
            int r11 = java.lang.Long.hashCode(r155)
            r155 = r11
            androidx.compose.runtime.CompositionLocalMap r11 = r4.getCurrentCompositionLocalMap()
            r156 = r13
            r162 = r14
            r13 = r152
            androidx.compose.ui.Modifier r14 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r13)
            androidx.compose.ui.node.ComposeUiNode$Companion r152 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r152 = r152.getConstructor()
            r157 = r4
            int r4 = r149 << 6
            r4 = r4 & 896(0x380, float:1.256E-42)
            r63 = 6
            r4 = r4 | 6
            r158 = r157
            r159 = r152
            r152 = 0
            r160 = r13
            r163 = r15
            r13 = r158
            r15 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r15, r12)
            androidx.compose.runtime.Applier r15 = r13.getApplier()
            boolean r15 = r15 instanceof androidx.compose.runtime.Applier
            if (r15 != 0) goto L1411
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L1411:
            r13.startReusableNode()
            boolean r15 = r13.getInserting()
            if (r15 == 0) goto L1420
            r15 = r159
            r13.createNode(r15)
            goto L1425
        L1420:
            r15 = r159
            r13.useNode()
        L1425:
            r158 = r13
            androidx.compose.runtime.Composer r13 = androidx.compose.runtime.Updater.m4364constructorimpl(r158)
            r159 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r164 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r165 = r15
            kotlin.jvm.functions.Function2 r15 = r164.getSetMeasurePolicy()
            r173 = r5
            r5 = r150
            androidx.compose.runtime.Updater.m4372setimpl(r13, r5, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r15 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r15 = r15.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r11, r15)
            java.lang.Integer r15 = java.lang.Integer.valueOf(r155)
            androidx.compose.ui.node.ComposeUiNode$Companion r150 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r164 = r5
            kotlin.jvm.functions.Function2 r5 = r150.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r13, r15, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r5 = r5.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r13, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r5 = r5.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r14, r5)
            int r5 = r4 >> 6
            r5 = r5 & 14
            r13 = r158
            r15 = 0
            r150 = r4
            r4 = 1833054614(0x6d423196, float:3.7562524E27)
            r159 = r5
            java.lang.String r5 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r4, r5)
            androidx.compose.foundation.layout.BoxScopeInstance r4 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r5 = r8 >> 6
            r5 = r5 & 112(0x70, float:1.57E-43)
            r63 = 6
            r5 = r5 | 6
            androidx.compose.foundation.layout.BoxScope r4 = (androidx.compose.foundation.layout.BoxScope) r4
            r260 = r13
            r166 = 0
            r167 = r4
            r4 = -864424712(0xffffffffcc79ecf8, float:-6.5516512E7)
            r168 = r5
            java.lang.String r5 = "C374@19859L520,370@19406L39,368@19270L1298:BillingScreen.kt#7ez3px"
            r169 = r8
            r8 = r260
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r4, r5)
            java.lang.String r4 = BillingScreen$lambda$3(r29)
            androidx.compose.material3.OutlinedTextFieldDefaults r174 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r196 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r198 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            long r183 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r185 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r175 = r5.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r177 = r5.m5131getWhite0d7_KjU()
            r179 = 0
            r181 = 0
            r187 = 0
            r189 = 0
            r191 = 0
            r193 = 0
            r195 = 0
            r200 = 0
            r202 = 0
            r204 = 0
            r206 = 0
            r208 = 0
            r210 = 0
            r212 = 0
            r214 = 0
            r216 = 0
            r218 = 0
            r220 = 0
            r222 = 0
            r224 = 0
            r226 = 0
            r228 = 0
            r230 = 0
            r232 = 0
            r234 = 0
            r236 = 0
            r238 = 0
            r240 = 0
            r242 = 0
            r244 = 0
            r246 = 0
            r248 = 0
            r250 = 0
            r252 = 0
            r254 = 0
            r171 = 0
            r16 = 0
            r5 = 54
            r261 = r5
            r5 = 0
            r262 = r5
            r263 = r5
            r264 = r5
            r5 = 3072(0xc00, float:4.305E-42)
            r265 = r5
            r5 = 2147477452(0x7fffe7cc, float:NaN)
            r266 = r5
            r5 = 4095(0xfff, float:5.738E-42)
            r267 = r5
            r258 = r16
            r256 = r171
            androidx.compose.material3.TextFieldColors r196 = r174.m2705colors0hiis_0(r175, r177, r179, r181, r183, r185, r187, r189, r191, r193, r195, r196, r198, r200, r202, r204, r206, r208, r210, r212, r214, r216, r218, r220, r222, r224, r226, r228, r230, r232, r234, r236, r238, r240, r242, r244, r246, r248, r250, r252, r254, r256, r258, r260, r261, r262, r263, r264, r265, r266, r267)
            r5 = 12
            r16 = 0
            r174 = r4
            float r4 = (float) r5
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.foundation.shape.RoundedCornerShape r4 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r4)
            androidx.compose.ui.Modifier$Companion r5 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r5 = (androidx.compose.ui.Modifier) r5
            r16 = r11
            r17 = r13
            r171 = r14
            r11 = 0
            r13 = 0
            r14 = 1
            androidx.compose.ui.Modifier r176 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r5, r11, r14, r13)
            r5 = -859165568(0xffffffffccca2c80, float:-1.05997312E8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r5, r6)
            boolean r5 = r7.changedInstance(r1)
            r11 = r8
            r13 = 0
            java.lang.Object r14 = r11.rememberedValue()
            r172 = 0
            if (r5 != 0) goto L1579
            androidx.compose.runtime.Composer$Companion r175 = androidx.compose.runtime.Composer.INSTANCE
            r177 = r5
            java.lang.Object r5 = r175.getEmpty()
            if (r14 != r5) goto L1578
            goto L157b
        L1578:
            goto L1588
        L1579:
            r177 = r5
        L157b:
            r5 = 0
            r175 = r5
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda29 r5 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda29
            r5.<init>()
            r11.updateRememberedValue(r5)
            r14 = r5
        L1588:
            r175 = r14
            kotlin.jvm.functions.Function1 r175 = (kotlin.jvm.functions.Function1) r175
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r8)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r5 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r181 = r5.getLambda$184048640$app()
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r5 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r184 = r5.m8425getLambda$1484147632$app()
            r195 = r4
            androidx.compose.ui.graphics.Shape r195 = (androidx.compose.ui.graphics.Shape) r195
            r177 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r182 = 0
            r183 = 0
            r185 = 0
            r186 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 1
            r192 = 0
            r193 = 0
            r194 = 0
            r198 = 12583296(0xc00180, float:1.7632953E-38)
            r199 = 12582918(0xc00006, float:1.7632424E-38)
            r200 = 0
            r201 = 1964920(0x1dfb78, float:2.75344E-39)
            r197 = r8
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198, r199, r200, r201)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r17)
            r158.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r158)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r157)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r151)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r8 = 0
            r13 = 1
            r14 = 0
            androidx.compose.ui.Modifier r146 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r4, r14, r13, r8)
            long r147 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            r150 = 2
            r151 = 0
            r149 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.BackgroundKt.m262backgroundbw27NRU$default(r146, r147, r149, r150, r151)
            r5 = 16
            r8 = 0
            float r11 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            r8 = 8
            r11 = 0
            float r13 = (float) r8
            float r8 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r13)
            androidx.compose.ui.Modifier r146 = androidx.compose.foundation.layout.PaddingKt.m817paddingVpY3zN4(r4, r5, r8)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r5 = 8
            r8 = 0
            float r11 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r4 = r4.m686spacedBy0680j_4(r5)
            r150 = r4
            androidx.compose.foundation.layout.Arrangement$Horizontal r150 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r150
            r4 = 1488265080(0x58b51f78, float:1.5931741E15)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r4, r6)
            r11 = r69
            boolean r4 = r7.changed(r11)
            boolean r5 = r7.changedInstance(r1)
            r4 = r4 | r5
            r14 = r68
            boolean r5 = r7.changed(r14)
            r4 = r4 | r5
            r5 = r10
            r8 = 0
            java.lang.Object r13 = r5.rememberedValue()
            r15 = 0
            if (r4 != 0) goto L1655
            androidx.compose.runtime.Composer$Companion r16 = androidx.compose.runtime.Composer.INSTANCE
            r17 = r4
            java.lang.Object r4 = r16.getEmpty()
            if (r13 != r4) goto L1654
            goto L1657
        L1654:
            goto L1664
        L1655:
            r17 = r4
        L1657:
            r4 = 0
            r16 = r4
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda30 r4 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda30
            r4.<init>()
            r5.updateRememberedValue(r4)
            r13 = r4
        L1664:
            r155 = r13
            kotlin.jvm.functions.Function1 r155 = (kotlin.jvm.functions.Function1) r155
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r10)
            r147 = 0
            r148 = 0
            r149 = 0
            r151 = 0
            r152 = 0
            r153 = 0
            r154 = 0
            r157 = 24576(0x6000, float:3.4438E-41)
            r158 = 494(0x1ee, float:6.92E-43)
            r156 = r10
            androidx.compose.foundation.lazy.LazyDslKt.LazyRow(r146, r147, r148, r149, r150, r151, r152, r153, r154, r155, r156, r157, r158)
            r157 = r156
            long r148 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            r151 = 0
            r152 = 3
            r146 = 0
            r147 = 0
            r150 = r157
            androidx.compose.material3.DividerKt.m2396HorizontalDivider9IZ8Weo(r146, r147, r148, r150, r151, r152)
            r10 = r150
            boolean r4 = BillingScreen$lambda$11(r55)
            if (r4 == 0) goto L17e7
            r4 = -1105541665(0xffffffffbe1ac5df, float:-0.15114544)
            r10.startReplaceGroup(r4)
            java.lang.String r4 = "439@24099L188"
            androidx.compose.runtime.ComposerKt.sourceInformation(r10, r4)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r5 = 1
            r8 = 0
            r13 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r4, r8, r5, r13)
            androidx.compose.ui.Alignment$Companion r5 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r5 = r5.getCenter()
            r8 = 54
            r13 = r10
            r15 = 0
            r16 = r4
            java.lang.String r4 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r69 = r11
            r11 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r11, r4)
            r4 = 0
            androidx.compose.ui.layout.MeasurePolicy r11 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r5, r4)
            int r17 = r8 << 3
            r17 = r17 & 112(0x70, float:1.57E-43)
            r32 = r11
            r68 = r13
            r146 = r16
            r147 = 0
            r148 = r4
            r4 = r68
            r68 = r5
            r5 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r5, r3)
            r3 = 0
            long r149 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r3)
            int r3 = java.lang.Long.hashCode(r149)
            androidx.compose.runtime.CompositionLocalMap r5 = r4.getCurrentCompositionLocalMap()
            r59 = r3
            r3 = r146
            r146 = r11
            androidx.compose.ui.Modifier r11 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r149 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r149 = r149.getConstructor()
            r150 = r3
            int r3 = r17 << 6
            r3 = r3 & 896(0x380, float:1.256E-42)
            r63 = 6
            r3 = r3 | 6
            r151 = r4
            r152 = r149
            r149 = 0
            r153 = r4
            r77 = r13
            r13 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r13, r12)
            androidx.compose.runtime.Applier r12 = r4.getApplier()
            boolean r12 = r12 instanceof androidx.compose.runtime.Applier
            if (r12 != 0) goto L172a
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L172a:
            r4.startReusableNode()
            boolean r12 = r4.getInserting()
            if (r12 == 0) goto L1739
            r12 = r152
            r4.createNode(r12)
            goto L173e
        L1739:
            r12 = r152
            r4.useNode()
        L173e:
            androidx.compose.runtime.Composer r13 = androidx.compose.runtime.Updater.m4364constructorimpl(r4)
            r151 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r152 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r154 = r4
            kotlin.jvm.functions.Function2 r4 = r152.getSetMeasurePolicy()
            r152 = r12
            r12 = r32
            androidx.compose.runtime.Updater.m4372setimpl(r13, r12, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r5, r4)
            java.lang.Integer r4 = java.lang.Integer.valueOf(r59)
            androidx.compose.ui.node.ComposeUiNode$Companion r32 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r155 = r5
            kotlin.jvm.functions.Function2 r5 = r32.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r13, r4, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r13, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r11, r4)
            int r4 = r3 >> 6
            r4 = r4 & 14
            r5 = r154
            r13 = 0
            r32 = r3
            r3 = 1833054614(0x6d423196, float:3.7562524E27)
            r151 = r4
            java.lang.String r4 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r3, r4)
            androidx.compose.foundation.layout.BoxScopeInstance r3 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r4 = r8 >> 6
            r4 = r4 & 112(0x70, float:1.57E-43)
            r63 = 6
            r4 = r4 | 6
            androidx.compose.foundation.layout.BoxScope r3 = (androidx.compose.foundation.layout.BoxScope) r3
            r182 = r5
            r156 = 0
            r157 = r3
            r3 = 588365018(0x2311bcda, float:7.900457E-18)
            r158 = r4
            java.lang.String r4 = "C440@24206L43:BillingScreen.kt#7ez3px"
            r159 = r5
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r3, r4)
            long r175 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            r183 = 0
            r184 = 61
            r174 = 0
            r177 = 0
            r178 = 0
            r180 = 0
            r181 = 0
            androidx.compose.material3.ProgressIndicatorKt.m2724CircularProgressIndicator4lLiAd8(r174, r175, r177, r178, r180, r181, r182, r183, r184)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r5)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r159)
            r154.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r154)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r77)
            r10.endReplaceGroup()
            r157 = r10
            r164 = r14
            r11 = r30
            goto L1d6d
        L17e7:
            r69 = r11
            java.lang.String r4 = BillingScreen$lambda$12(r56)
            if (r4 == 0) goto L1b5d
            r4 = -1105234889(0xffffffffbe1f7437, float:-0.15571676)
            r10.startReplaceGroup(r4)
            java.lang.String r4 = "443@24384L964"
            androidx.compose.runtime.ComposerKt.sourceInformation(r10, r4)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r5 = 1
            r8 = 0
            r13 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r4, r8, r5, r13)
            androidx.compose.ui.Alignment$Companion r5 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r5 = r5.getCenter()
            r8 = 54
            r11 = r10
            r13 = 0
            java.lang.String r15 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r32 = r4
            r4 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r4, r15)
            r4 = 0
            androidx.compose.ui.layout.MeasurePolicy r15 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r5, r4)
            int r16 = r8 << 3
            r16 = r16 & 112(0x70, float:1.57E-43)
            r68 = r15
            r146 = r11
            r147 = r32
            r148 = 0
            r149 = r4
            r4 = r146
            r146 = r5
            r5 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r5, r3)
            r5 = 0
            long r150 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r5)
            int r5 = java.lang.Long.hashCode(r150)
            r150 = r5
            androidx.compose.runtime.CompositionLocalMap r5 = r4.getCurrentCompositionLocalMap()
            r151 = r11
            r11 = r147
            r147 = r13
            androidx.compose.ui.Modifier r13 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r152 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r152 = r152.getConstructor()
            r153 = r4
            int r4 = r16 << 6
            r4 = r4 & 896(0x380, float:1.256E-42)
            r63 = 6
            r4 = r4 | 6
            r154 = r153
            r155 = r152
            r152 = 0
            r156 = r11
            r164 = r14
            r11 = r154
            r14 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r14, r12)
            androidx.compose.runtime.Applier r14 = r11.getApplier()
            boolean r14 = r14 instanceof androidx.compose.runtime.Applier
            if (r14 != 0) goto L187d
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L187d:
            r11.startReusableNode()
            boolean r14 = r11.getInserting()
            if (r14 == 0) goto L188c
            r14 = r155
            r11.createNode(r14)
            goto L1891
        L188c:
            r14 = r155
            r11.useNode()
        L1891:
            r154 = r11
            androidx.compose.runtime.Composer r11 = androidx.compose.runtime.Updater.m4364constructorimpl(r154)
            r155 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r157 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r158 = r14
            kotlin.jvm.functions.Function2 r14 = r157.getSetMeasurePolicy()
            r157 = r15
            r15 = r68
            androidx.compose.runtime.Updater.m4372setimpl(r11, r15, r14)
            androidx.compose.ui.node.ComposeUiNode$Companion r14 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r14 = r14.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r5, r14)
            java.lang.Integer r14 = java.lang.Integer.valueOf(r150)
            androidx.compose.ui.node.ComposeUiNode$Companion r68 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r159 = r5
            kotlin.jvm.functions.Function2 r5 = r68.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r11, r14, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r5 = r5.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r11, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r5 = r5.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r11, r13, r5)
            int r5 = r4 >> 6
            r5 = r5 & 14
            r11 = r154
            r14 = 0
            r68 = r4
            r4 = 1833054614(0x6d423196, float:3.7562524E27)
            r155 = r5
            java.lang.String r5 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r4, r5)
            androidx.compose.foundation.layout.BoxScopeInstance r4 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r5 = r8 >> 6
            r5 = r5 & 112(0x70, float:1.57E-43)
            r63 = 6
            r5 = r5 | 6
            androidx.compose.foundation.layout.BoxScope r4 = (androidx.compose.foundation.layout.BoxScope) r4
            r160 = r11
            r165 = 0
            r166 = r4
            r4 = -2017403653(0xffffffff87c0dcfb, float:-2.901883E-34)
            r167 = r5
            java.lang.String r5 = "C444@24491L819:BillingScreen.kt#7ez3px"
            r168 = r8
            r8 = r160
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r4, r5)
            androidx.compose.ui.Alignment$Companion r4 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r4 = r4.getCenterHorizontally()
            r5 = 384(0x180, float:5.38E-43)
            r169 = 0
            r171 = r8
            r8 = 1341605231(0x4ff7456f, float:8.2970455E9)
            r172 = r11
            java.lang.String r11 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            r174 = r13
            r13 = r160
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r8, r11)
            androidx.compose.ui.Modifier$Companion r8 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r8 = (androidx.compose.ui.Modifier) r8
            androidx.compose.foundation.layout.Arrangement r11 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r11 = r11.getTop()
            int r160 = r5 >> 3
            r160 = r160 & 14
            int r175 = r5 >> 3
            r175 = r175 & 112(0x70, float:1.57E-43)
            r176 = r8
            r8 = r160 | r175
            androidx.compose.ui.layout.MeasurePolicy r8 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r11, r4, r13, r8)
            int r160 = r5 << 3
            r160 = r160 & 112(0x70, float:1.57E-43)
            r175 = r13
            r177 = r176
            r178 = r8
            r179 = 0
            r180 = r4
            r17 = r8
            r4 = r175
            r8 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r8, r3)
            r3 = 0
            long r181 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r3)
            int r3 = java.lang.Long.hashCode(r181)
            androidx.compose.runtime.CompositionLocalMap r8 = r4.getCurrentCompositionLocalMap()
            r59 = r3
            r175 = r11
            r3 = r177
            androidx.compose.ui.Modifier r11 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r177 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r177 = r177.getConstructor()
            r181 = r3
            int r3 = r160 << 6
            r3 = r3 & 896(0x380, float:1.256E-42)
            r63 = 6
            r3 = r3 | 6
            r182 = r4
            r183 = r177
            r177 = 0
            r184 = r4
            r77 = r13
            r13 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r13, r12)
            androidx.compose.runtime.Applier r12 = r4.getApplier()
            boolean r12 = r12 instanceof androidx.compose.runtime.Applier
            if (r12 != 0) goto L1996
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L1996:
            r4.startReusableNode()
            boolean r12 = r4.getInserting()
            if (r12 == 0) goto L19a5
            r12 = r183
            r4.createNode(r12)
            goto L19aa
        L19a5:
            r12 = r183
            r4.useNode()
        L19aa:
            androidx.compose.runtime.Composer r13 = androidx.compose.runtime.Updater.m4364constructorimpl(r4)
            r182 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r183 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r185 = r4
            kotlin.jvm.functions.Function2 r4 = r183.getSetMeasurePolicy()
            r183 = r12
            r12 = r178
            androidx.compose.runtime.Updater.m4372setimpl(r13, r12, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r8, r4)
            java.lang.Integer r4 = java.lang.Integer.valueOf(r59)
            androidx.compose.ui.node.ComposeUiNode$Companion r178 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r186 = r8
            kotlin.jvm.functions.Function2 r8 = r178.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r13, r4, r8)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r13, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r11, r4)
            int r4 = r3 >> 6
            r4 = r4 & 14
            r8 = r185
            r13 = 0
            r178 = r3
            r3 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            r182 = r4
            java.lang.String r4 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r8, r3, r4)
            androidx.compose.foundation.layout.ColumnScopeInstance r3 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r4 = r5 >> 6
            r4 = r4 & 112(0x70, float:1.57E-43)
            r63 = 6
            r4 = r4 | 6
            androidx.compose.foundation.layout.ColumnScope r3 = (androidx.compose.foundation.layout.ColumnScope) r3
            r192 = r8
            r213 = 0
            r214 = r3
            r3 = 1468647076(0x5789c6a4, float:3.02972496E14)
            r215 = r4
            java.lang.String r4 = "C445@24596L88,446@24729L30,447@24804L54,448@24903L30,450@25044L47,451@25165L39,449@24978L290:BillingScreen.kt#7ez3px"
            r216 = r5
            r5 = r192
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r3, r4)
            androidx.compose.material.icons.Icons r3 = androidx.compose.material.icons.Icons.INSTANCE
            androidx.compose.material.icons.Icons$Filled r3 = r3.getDefault()
            androidx.compose.ui.graphics.vector.ImageVector r187 = androidx.compose.material.icons.filled.WifiOffKt.getWifiOff(r3)
            long r190 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            androidx.compose.ui.Modifier$Companion r3 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r3 = (androidx.compose.ui.Modifier) r3
            r4 = 48
            r188 = 0
            float r5 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r5)
            androidx.compose.ui.Modifier r189 = androidx.compose.foundation.layout.SizeKt.m862size3ABfNKs(r3, r4)
            r193 = 432(0x1b0, float:6.05E-43)
            r194 = 0
            r188 = 0
            androidx.compose.material3.IconKt.m2517Iconww6aTOc(r187, r188, r189, r190, r192, r193, r194)
            r5 = r192
            androidx.compose.ui.Modifier$Companion r3 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r3 = (androidx.compose.ui.Modifier) r3
            r4 = 12
            r187 = 0
            r217 = r8
            float r8 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r8)
            androidx.compose.ui.Modifier r3 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r3, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r3, r5, r4)
            java.lang.String r3 = BillingScreen$lambda$12(r56)
            if (r3 != 0) goto L1a68
            java.lang.String r3 = "Error occurred"
        L1a68:
            r187 = r3
            long r189 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r211 = 0
            r212 = 262138(0x3fffa, float:3.67334E-40)
            r188 = 0
            r191 = 0
            r192 = 0
            r194 = 0
            r195 = 0
            r196 = 0
            r197 = 0
            r199 = 0
            r200 = 0
            r201 = 0
            r203 = 0
            r204 = 0
            r205 = 0
            r206 = 0
            r207 = 0
            r208 = 0
            r210 = 0
            r209 = r5
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r187, r188, r189, r191, r192, r194, r195, r196, r197, r199, r200, r201, r203, r204, r205, r206, r207, r208, r209, r210, r211, r212)
            androidx.compose.ui.Modifier$Companion r3 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r3 = (androidx.compose.ui.Modifier) r3
            r4 = 12
            r8 = 0
            r187 = r8
            float r8 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r8)
            androidx.compose.ui.Modifier r3 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r3, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r3, r5, r4)
            r3 = -1060989234(0xffffffffc0c296ce, float:-6.080909)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r3, r6)
            boolean r3 = r7.changedInstance(r1)
            r4 = r5
            r8 = 0
            r192 = r5
            java.lang.Object r5 = r4.rememberedValue()
            r187 = 0
            if (r3 != 0) goto L1ad2
            androidx.compose.runtime.Composer$Companion r188 = androidx.compose.runtime.Composer.INSTANCE
            r189 = r3
            java.lang.Object r3 = r188.getEmpty()
            if (r5 != r3) goto L1ad1
            goto L1ad4
        L1ad1:
            goto L1ae1
        L1ad2:
            r189 = r3
        L1ad4:
            r3 = 0
            r188 = r3
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda31 r3 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda31
            r3.<init>()
            r4.updateRememberedValue(r3)
            r5 = r3
        L1ae1:
            kotlin.jvm.functions.Function0 r5 = (kotlin.jvm.functions.Function0) r5
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r192)
            androidx.compose.material3.ButtonDefaults r187 = androidx.compose.material3.ButtonDefaults.INSTANCE
            long r188 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            int r3 = androidx.compose.material3.ButtonDefaults.$stable
            int r197 = r3 << 12
            r198 = 14
            r190 = 0
            r209 = r192
            r192 = 0
            r194 = 0
            r196 = r209
            androidx.compose.material3.ButtonColors r191 = r187.m2121buttonColorsro_MJ88(r188, r190, r192, r194, r196, r197, r198)
            r192 = r196
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r3 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function3 r196 = r3.getLambda$133142191$app()
            r188 = 0
            r189 = 0
            r190 = 0
            r209 = r192
            r192 = 0
            r193 = 0
            r194 = 0
            r195 = 0
            r198 = 805306368(0x30000000, float:4.656613E-10)
            r199 = 494(0x1ee, float:6.92E-43)
            r187 = r5
            r197 = r209
            androidx.compose.material3.ButtonKt.Button(r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198, r199)
            r192 = r197
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r192)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r217)
            r185.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r185)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r184)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r77)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r171)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r172)
            r154.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r154)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r151)
            r10.endReplaceGroup()
            r157 = r10
            r11 = r30
            goto L1d6d
        L1b5d:
            r164 = r14
            boolean r4 = r0.isEmpty()
            if (r4 == 0) goto L1cc1
            r4 = -1104196203(0xffffffffbe2f4d95, float:-0.17119439)
            r10.startReplaceGroup(r4)
            java.lang.String r4 = "456@25455L198"
            androidx.compose.runtime.ComposerKt.sourceInformation(r10, r4)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r8 = 0
            r13 = 1
            r14 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r4, r14, r13, r8)
            androidx.compose.ui.Alignment$Companion r5 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r5 = r5.getCenter()
            r8 = 54
            r11 = r10
            r13 = 0
            java.lang.String r14 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r15 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r15, r14)
            r14 = 0
            androidx.compose.ui.layout.MeasurePolicy r15 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r5, r14)
            int r16 = r8 << 3
            r16 = r16 & 112(0x70, float:1.57E-43)
            r32 = r15
            r68 = r11
            r146 = r4
            r147 = 0
            r148 = r4
            r17 = r5
            r4 = r68
            r5 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r5, r3)
            r3 = 0
            long r149 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r3)
            int r3 = java.lang.Long.hashCode(r149)
            androidx.compose.runtime.CompositionLocalMap r5 = r4.getCurrentCompositionLocalMap()
            r59 = r3
            r3 = r146
            androidx.compose.ui.Modifier r11 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r146 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r146 = r146.getConstructor()
            r149 = r3
            int r3 = r16 << 6
            r3 = r3 & 896(0x380, float:1.256E-42)
            r63 = 6
            r3 = r3 | 6
            r150 = r4
            r151 = r146
            r146 = 0
            r152 = r4
            r77 = r13
            r13 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r13, r12)
            androidx.compose.runtime.Applier r12 = r4.getApplier()
            boolean r12 = r12 instanceof androidx.compose.runtime.Applier
            if (r12 != 0) goto L1beb
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L1beb:
            r4.startReusableNode()
            boolean r12 = r4.getInserting()
            if (r12 == 0) goto L1bfa
            r12 = r151
            r4.createNode(r12)
            goto L1bff
        L1bfa:
            r12 = r151
            r4.useNode()
        L1bff:
            androidx.compose.runtime.Composer r13 = androidx.compose.runtime.Updater.m4364constructorimpl(r4)
            r150 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r151 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r153 = r4
            kotlin.jvm.functions.Function2 r4 = r151.getSetMeasurePolicy()
            r151 = r12
            r12 = r32
            androidx.compose.runtime.Updater.m4372setimpl(r13, r12, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r5, r4)
            java.lang.Integer r4 = java.lang.Integer.valueOf(r59)
            androidx.compose.ui.node.ComposeUiNode$Companion r32 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r154 = r5
            kotlin.jvm.functions.Function2 r5 = r32.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r13, r4, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r13, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r13, r11, r4)
            int r4 = r3 >> 6
            r4 = r4 & 14
            r5 = r153
            r13 = 0
            r32 = r3
            r3 = 1833054614(0x6d423196, float:3.7562524E27)
            r150 = r4
            java.lang.String r4 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r3, r4)
            androidx.compose.foundation.layout.BoxScopeInstance r3 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r4 = r8 >> 6
            r4 = r4 & 112(0x70, float:1.57E-43)
            r63 = 6
            r4 = r4 | 6
            androidx.compose.foundation.layout.BoxScope r3 = (androidx.compose.foundation.layout.BoxScope) r3
            r196 = r5
            r155 = 0
            r156 = r3
            r3 = 1523515608(0x5acf00d8, float:2.91331239E16)
            r157 = r4
            java.lang.String r4 = "C457@25562L53:BillingScreen.kt#7ez3px"
            r158 = r5
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r3, r4)
            long r176 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r198 = 0
            r199 = 262138(0x3fffa, float:3.67334E-40)
            java.lang.String r174 = "No items match filters"
            r175 = 0
            r178 = 0
            r179 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r186 = 0
            r187 = 0
            r188 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r193 = 0
            r194 = 0
            r195 = 0
            r197 = 6
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r174, r175, r176, r178, r179, r181, r182, r183, r184, r186, r187, r188, r190, r191, r192, r193, r194, r195, r196, r197, r198, r199)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r196)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r158)
            r153.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r152)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r68)
            r10.endReplaceGroup()
            r157 = r10
            r11 = r30
            goto L1d6d
        L1cc1:
            r3 = -1103852878(0xffffffffbe348ab2, float:-0.17631033)
            r10.startReplaceGroup(r3)
            java.lang.String r3 = "466@26194L834,460@25731L1297"
            androidx.compose.runtime.ComposerKt.sourceInformation(r10, r3)
            androidx.compose.foundation.lazy.grid.GridCells$Fixed r3 = new androidx.compose.foundation.lazy.grid.GridCells$Fixed
            r4 = 2
            r3.<init>(r4)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r8 = 0
            r12 = 1
            r14 = 0
            androidx.compose.ui.Modifier r147 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r4, r14, r12, r8)
            r4 = 16
            r5 = 0
            float r8 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r8)
            androidx.compose.foundation.layout.PaddingValues r149 = androidx.compose.foundation.layout.PaddingKt.m809PaddingValues0680j_4(r4)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r5 = 12
            r8 = 0
            float r11 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r4 = r4.m686spacedBy0680j_4(r5)
            androidx.compose.foundation.layout.Arrangement r5 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r8 = 12
            r11 = 0
            float r12 = (float) r8
            float r8 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r12)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r5 = r5.m686spacedBy0680j_4(r8)
            r146 = r3
            androidx.compose.foundation.lazy.grid.GridCells r146 = (androidx.compose.foundation.lazy.grid.GridCells) r146
            r151 = r5
            androidx.compose.foundation.layout.Arrangement$Vertical r151 = (androidx.compose.foundation.layout.Arrangement.Vertical) r151
            r152 = r4
            androidx.compose.foundation.layout.Arrangement$Horizontal r152 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r152
            r3 = 1488426849(0x58b79761, float:1.61488636E15)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r3, r6)
            boolean r3 = r7.changedInstance(r0)
            boolean r4 = r7.changed(r9)
            r3 = r3 | r4
            r11 = r30
            boolean r4 = r7.changed(r11)
            r3 = r3 | r4
            boolean r4 = r7.changedInstance(r1)
            r3 = r3 | r4
            r4 = r10
            r5 = 0
            java.lang.Object r8 = r4.rememberedValue()
            r12 = 0
            if (r3 != 0) goto L1d41
            androidx.compose.runtime.Composer$Companion r13 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r13 = r13.getEmpty()
            if (r8 != r13) goto L1d40
            goto L1d41
        L1d40:
            goto L1d4c
        L1d41:
            r13 = 0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda32 r14 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda32
            r14.<init>()
            r4.updateRememberedValue(r14)
            r8 = r14
        L1d4c:
            r156 = r8
            kotlin.jvm.functions.Function1 r156 = (kotlin.jvm.functions.Function1) r156
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r10)
            r148 = 0
            r150 = 0
            r153 = 0
            r154 = 0
            r155 = 0
            r158 = 1772592(0x1b0c30, float:2.48393E-39)
            r159 = 0
            r160 = 916(0x394, float:1.284E-42)
            r157 = r10
            androidx.compose.foundation.lazy.grid.LazyGridDslKt.LazyVerticalGrid(r146, r147, r148, r149, r150, r151, r152, r153, r154, r155, r156, r157, r158, r159, r160)
            r157.endReplaceGroup()
        L1d6d:
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r157)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r123)
            r45.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r45)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r44)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r38)
            java.util.Map r3 = BillingScreen$lambda$4(r9)
            boolean r3 = r3.isEmpty()
            if (r3 != 0) goto L1ec5
            r3 = -1603603923(0xffffffffa06af22d, float:-1.99007E-19)
            r2.startReplaceGroup(r3)
            java.lang.String r3 = "492@27630L28,494@27789L37,496@27970L38,497@28043L2907,488@27405L3545"
            androidx.compose.runtime.ComposerKt.sourceInformation(r2, r3)
            java.util.Map r3 = BillingScreen$lambda$4(r9)
            java.util.Collection r3 = r3.values()
            java.lang.Iterable r3 = (java.lang.Iterable) r3
            int r3 = kotlin.collections.CollectionsKt.sumOfInt(r3)
            java.util.Map r4 = BillingScreen$lambda$4(r9)
            java.util.Set r4 = r4.entrySet()
            java.lang.Iterable r4 = (java.lang.Iterable) r4
            java.util.Iterator r4 = r4.iterator()
            r12 = 0
        L1db7:
            boolean r5 = r4.hasNext()
            if (r5 == 0) goto L1de2
            java.lang.Object r5 = r4.next()
            java.util.Map$Entry r5 = (java.util.Map.Entry) r5
            r8 = 0
            java.lang.Object r10 = r5.getKey()
            com.example.sasloopmanager.data.MenuItem r10 = (com.example.sasloopmanager.data.MenuItem) r10
            java.lang.Object r5 = r5.getValue()
            java.lang.Number r5 = (java.lang.Number) r5
            int r5 = r5.intValue()
            double r14 = r10.getPrice()
            r30 = r7
            r16 = r8
            double r7 = (double) r5
            double r14 = r14 * r7
            double r12 = r12 + r14
            r7 = r30
            goto L1db7
        L1de2:
            r30 = r7
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            r8 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r4, r14, r10, r8)
            r5 = 16
            r7 = 0
            float r8 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r8)
            androidx.compose.ui.Modifier r34 = androidx.compose.foundation.layout.PaddingKt.m816padding3ABfNKs(r4, r5)
            r4 = -190266452(0xfffffffff4a8c3ac, float:-1.0696711E32)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r4, r6)
            r5 = r173
            boolean r4 = r2.changed(r5)
            r6 = r2
            r7 = 0
            java.lang.Object r8 = r6.rememberedValue()
            r10 = 0
            if (r4 != 0) goto L1e1a
            androidx.compose.runtime.Composer$Companion r14 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r14 = r14.getEmpty()
            if (r8 != r14) goto L1e19
            goto L1e1a
        L1e19:
            goto L1e25
        L1e1a:
            r14 = 0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda33 r15 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda33
            r15.<init>()
            r6.updateRememberedValue(r15)
            r8 = r15
        L1e25:
            r39 = r8
            kotlin.jvm.functions.Function0 r39 = (kotlin.jvm.functions.Function0) r39
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r2)
            r40 = 15
            r41 = 0
            r35 = 0
            r36 = 0
            r37 = 0
            r38 = 0
            androidx.compose.ui.Modifier r4 = androidx.compose.foundation.ClickableKt.m297clickableoSLSa3U$default(r34, r35, r36, r37, r38, r39, r40, r41)
            r6 = 16
            r7 = 0
            float r8 = (float) r6
            float r6 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r8)
            androidx.compose.foundation.shape.RoundedCornerShape r6 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r6)
            androidx.compose.material3.CardDefaults r34 = androidx.compose.material3.CardDefaults.INSTANCE
            long r35 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            int r7 = androidx.compose.material3.CardDefaults.$stable
            int r44 = r7 << 12
            r45 = 14
            r37 = 0
            r39 = 0
            r41 = 0
            r43 = r2
            androidx.compose.material3.CardColors r2 = r34.m2141cardColorsro_MJ88(r35, r37, r39, r41, r43, r44, r45)
            r7 = 1
            r8 = 0
            float r10 = (float) r7
            float r7 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            long r14 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.foundation.BorderStroke r7 = androidx.compose.foundation.BorderStrokeKt.m288BorderStrokecXLIe8U(r7, r14)
            androidx.compose.material3.CardDefaults r34 = androidx.compose.material3.CardDefaults.INSTANCE
            r8 = 8
            r10 = 0
            float r14 = (float) r8
            float r35 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            int r8 = androidx.compose.material3.CardDefaults.$stable
            int r8 = r8 << 18
            r63 = 6
            r42 = r8 | 6
            r36 = 0
            r37 = 0
            r38 = 0
            r39 = 0
            r40 = 0
            r41 = r43
            r43 = 62
            androidx.compose.material3.CardElevation r37 = r34.m2142cardElevationaqJV_2Y(r35, r36, r37, r38, r39, r40, r41, r42, r43)
            r8 = r41
            r35 = r6
            androidx.compose.ui.graphics.Shape r35 = (androidx.compose.ui.graphics.Shape) r35
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda34 r6 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda34
            r6.<init>()
            r10 = -1381145432(0xffffffffadad64a8, float:-1.9712523E-11)
            r14 = 54
            r15 = 1
            androidx.compose.runtime.internal.ComposableLambda r6 = androidx.compose.runtime.internal.ComposableLambdaKt.rememberComposableLambda(r10, r15, r6, r8, r14)
            r39 = r6
            kotlin.jvm.functions.Function3 r39 = (kotlin.jvm.functions.Function3) r39
            r41 = 196608(0x30000, float:2.75506E-40)
            r42 = 0
            r36 = r2
            r34 = r4
            r38 = r7
            r40 = r8
            androidx.compose.material3.CardKt.Card(r34, r35, r36, r37, r38, r39, r40, r41, r42)
            r7 = r40
            r7.endReplaceGroup()
            goto L1ed3
        L1ec5:
            r30 = r7
            r5 = r173
            r7 = r2
            r2 = -1599970382(0xffffffffa0a263b2, float:-2.750984E-19)
            r7.startReplaceGroup(r2)
            r7.endReplaceGroup()
        L1ed3:
            r7.endReplaceGroup()
            r43 = r287
            r67 = r0
            r153 = r7
            r268 = r9
            r270 = r11
            r285 = r30
            r68 = r33
            r283 = r61
            r274 = r62
            r284 = r66
            r174 = r114
            r271 = r144
            r4 = r170
            r144 = r5
            r114 = r108
            r170 = r115
            r115 = r102
            r108 = r106
            r102 = r95
            r95 = r97
            r106 = r99
            r97 = r80
            r99 = r88
            r80 = r20
            r88 = r82
            r20 = r120
            r82 = r79
            r120 = r107
            r79 = r73
            r107 = r101
            r73 = r72
            r101 = r90
            r72 = r69
            r90 = r81
            r69 = r164
            r81 = r19
            r19 = r53
            goto L401e
        L1f29:
            r145 = r15
            r11 = r30
            r164 = r68
            r30 = r7
            r7 = r2
            r2 = -1598928720(0xffffffffa0b248b0, float:-3.0202473E-19)
            r7.startReplaceGroup(r2)
            r2 = r67
            androidx.compose.runtime.ComposerKt.sourceInformation(r7, r2)
            java.util.Map r2 = BillingScreen$lambda$4(r9)
            boolean r2 = r2.isEmpty()
            if (r2 == 0) goto L22fc
            r2 = -1599786862(0xffffffffa0a53092, float:-2.7984228E-19)
            r7.startReplaceGroup(r2)
            java.lang.String r2 = "542@31162L1120"
            androidx.compose.runtime.ComposerKt.sourceInformation(r7, r2)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            r34 = r2
            androidx.compose.ui.Modifier r34 = (androidx.compose.ui.Modifier) r34
            r37 = 2
            r38 = 0
            r35 = 1065353216(0x3f800000, float:1.0)
            r36 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.ColumnScope.weight$default(r33, r34, r35, r36, r37, r38)
            r8 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r14, r10, r8)
            androidx.compose.ui.Alignment$Companion r4 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r4 = r4.getCenter()
            r8 = 48
            r10 = r7
            r13 = 0
            java.lang.String r14 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r15 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r15, r14)
            r14 = 0
            androidx.compose.ui.layout.MeasurePolicy r15 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r4, r14)
            int r16 = r8 << 3
            r16 = r16 & 112(0x70, float:1.57E-43)
            r18 = r15
            r27 = r2
            r32 = r10
            r34 = 0
            r67 = r0
            r0 = r32
            r32 = r2
            r2 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r2, r3)
            r2 = 0
            long r35 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r2)
            int r2 = java.lang.Long.hashCode(r35)
            r35 = r2
            androidx.compose.runtime.CompositionLocalMap r2 = r0.getCurrentCompositionLocalMap()
            r36 = r4
            r4 = r27
            r27 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r37 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r37 = r37.getConstructor()
            r38 = r0
            int r0 = r16 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r39 = r37
            r37 = r38
            r40 = 0
            r41 = r4
            r4 = r37
            r37 = r13
            r13 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r13, r12)
            androidx.compose.runtime.Applier r13 = r4.getApplier()
            boolean r13 = r13 instanceof androidx.compose.runtime.Applier
            if (r13 != 0) goto L1fe3
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L1fe3:
            r4.startReusableNode()
            boolean r13 = r4.getInserting()
            if (r13 == 0) goto L1ff2
            r13 = r39
            r4.createNode(r13)
            goto L1ff7
        L1ff2:
            r13 = r39
            r4.useNode()
        L1ff7:
            r39 = r4
            androidx.compose.runtime.Composer r4 = androidx.compose.runtime.Updater.m4364constructorimpl(r39)
            r42 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r43 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r44 = r13
            kotlin.jvm.functions.Function2 r13 = r43.getSetMeasurePolicy()
            r43 = r14
            r14 = r18
            androidx.compose.runtime.Updater.m4372setimpl(r4, r14, r13)
            androidx.compose.ui.node.ComposeUiNode$Companion r13 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r13 = r13.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r2, r13)
            java.lang.Integer r13 = java.lang.Integer.valueOf(r35)
            androidx.compose.ui.node.ComposeUiNode$Companion r18 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r45 = r2
            kotlin.jvm.functions.Function2 r2 = r18.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r4, r13, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r2 = r2.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r4, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r2 = r2.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r10, r2)
            int r2 = r0 >> 6
            r2 = r2 & 14
            r4 = r39
            r13 = 0
            r18 = r0
            r0 = 1833054614(0x6d423196, float:3.7562524E27)
            r42 = r2
            java.lang.String r2 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r0, r2)
            androidx.compose.foundation.layout.BoxScopeInstance r0 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r2 = r8 >> 6
            r2 = r2 & 112(0x70, float:1.57E-43)
            r63 = 6
            r2 = r2 | 6
            androidx.compose.foundation.layout.BoxScope r0 = (androidx.compose.foundation.layout.BoxScope) r0
            r46 = r4
            r47 = 0
            r48 = r0
            r0 = 160376930(0x98f2862, float:3.4463974E-33)
            r49 = r2
            java.lang.String r2 = "C546@31394L854:BillingScreen.kt#7ez3px"
            r50 = r4
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r0, r2)
            androidx.compose.ui.Alignment$Companion r0 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r0 = r0.getCenterHorizontally()
            r2 = 384(0x180, float:5.38E-43)
            r51 = 0
            r52 = r4
            r4 = 1341605231(0x4ff7456f, float:8.2970455E9)
            r58 = r8
            java.lang.String r8 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            r68 = r10
            r10 = r46
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r4, r8)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r4 = (androidx.compose.ui.Modifier) r4
            androidx.compose.foundation.layout.Arrangement r8 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r8 = r8.getTop()
            int r46 = r2 >> 3
            r46 = r46 & 14
            int r74 = r2 >> 3
            r74 = r74 & 112(0x70, float:1.57E-43)
            r118 = r4
            r4 = r46 | r74
            androidx.compose.ui.layout.MeasurePolicy r4 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r8, r0, r10, r4)
            int r46 = r2 << 3
            r46 = r46 & 112(0x70, float:1.57E-43)
            r74 = r4
            r123 = r10
            r146 = r118
            r147 = 0
            r148 = r0
            r17 = r4
            r0 = r123
            r4 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r4, r3)
            r3 = 0
            long r3 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r3)
            int r3 = java.lang.Long.hashCode(r3)
            androidx.compose.runtime.CompositionLocalMap r4 = r0.getCurrentCompositionLocalMap()
            r59 = r3
            r123 = r8
            r3 = r146
            androidx.compose.ui.Modifier r8 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r146 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r146 = r146.getConstructor()
            r149 = r0
            int r0 = r46 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r150 = r149
            r151 = r146
            r146 = 0
            r152 = r3
            r77 = r10
            r3 = r150
            r10 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r3, r10, r12)
            androidx.compose.runtime.Applier r10 = r3.getApplier()
            boolean r10 = r10 instanceof androidx.compose.runtime.Applier
            if (r10 != 0) goto L20fc
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L20fc:
            r3.startReusableNode()
            boolean r10 = r3.getInserting()
            if (r10 == 0) goto L210b
            r10 = r151
            r3.createNode(r10)
            goto L2110
        L210b:
            r10 = r151
            r3.useNode()
        L2110:
            androidx.compose.runtime.Composer r12 = androidx.compose.runtime.Updater.m4364constructorimpl(r3)
            r150 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r151 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r153 = r3
            kotlin.jvm.functions.Function2 r3 = r151.getSetMeasurePolicy()
            r151 = r10
            r10 = r74
            androidx.compose.runtime.Updater.m4372setimpl(r12, r10, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r3 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r3 = r3.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r4, r3)
            java.lang.Integer r3 = java.lang.Integer.valueOf(r59)
            androidx.compose.ui.node.ComposeUiNode$Companion r74 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r154 = r4
            kotlin.jvm.functions.Function2 r4 = r74.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r12, r3, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r3 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r3 = r3.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r12, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r3 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r3 = r3.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r8, r3)
            int r3 = r0 >> 6
            r3 = r3 & 14
            r4 = r153
            r12 = 0
            r74 = r0
            r0 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            r150 = r3
            java.lang.String r3 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r0, r3)
            androidx.compose.foundation.layout.ColumnScopeInstance r0 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r3 = r2 >> 6
            r3 = r3 & 112(0x70, float:1.57E-43)
            r63 = 6
            r3 = r3 | 6
            androidx.compose.foundation.layout.ColumnScope r0 = (androidx.compose.foundation.layout.ColumnScope) r0
            r160 = r4
            r163 = 0
            r165 = r0
            r0 = -475370237(0xffffffffe3aa6d03, float:-6.287603E21)
            r166 = r2
            java.lang.String r2 = "C547@31495L96,548@31632L30,549@31703L49,550@31793L30,552@31926L25,553@32021L39,551@31864L346:BillingScreen.kt#7ez3px"
            r167 = r3
            r3 = r160
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r3, r0, r2)
            androidx.compose.material.icons.Icons r0 = androidx.compose.material.icons.Icons.INSTANCE
            androidx.compose.material.icons.Icons$Filled r0 = r0.getDefault()
            androidx.compose.ui.graphics.vector.ImageVector r155 = androidx.compose.material.icons.filled.AddShoppingCartKt.getAddShoppingCart(r0)
            long r158 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 48
            r156 = 0
            float r3 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r3)
            androidx.compose.ui.Modifier r157 = androidx.compose.foundation.layout.SizeKt.m862size3ABfNKs(r0, r2)
            r161 = 432(0x1b0, float:6.05E-43)
            r162 = 0
            r156 = 0
            androidx.compose.material3.IconKt.m2517Iconww6aTOc(r155, r156, r157, r158, r160, r161, r162)
            r3 = r160
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 12
            r155 = 0
            r156 = r4
            float r4 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r0, r2)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r0, r3, r4)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r195 = 0
            r196 = 262138(0x3fffa, float:3.67334E-40)
            java.lang.String r171 = "Your cart is empty"
            r172 = 0
            r175 = 0
            r176 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r194 = 6
            r193 = r3
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 16
            r4 = 0
            r155 = r4
            float r4 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r0, r2)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r0, r3, r4)
            r0 = -153868754(0xfffffffff6d4262e, float:-2.1514479E33)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r3, r0, r6)
            boolean r0 = r3.changed(r5)
            r2 = r3
            r4 = 0
            java.lang.Object r6 = r2.rememberedValue()
            r63 = 0
            if (r0 != 0) goto L222e
            androidx.compose.runtime.Composer$Companion r155 = androidx.compose.runtime.Composer.INSTANCE
            r157 = r0
            java.lang.Object r0 = r155.getEmpty()
            if (r6 != r0) goto L222d
            goto L2230
        L222d:
            goto L223d
        L222e:
            r157 = r0
        L2230:
            r0 = 0
            r155 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda35 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda35
            r0.<init>()
            r2.updateRememberedValue(r0)
            r6 = r0
        L223d:
            kotlin.jvm.functions.Function0 r6 = (kotlin.jvm.functions.Function0) r6
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r3)
            androidx.compose.material3.ButtonDefaults r171 = androidx.compose.material3.ButtonDefaults.INSTANCE
            long r172 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            int r0 = androidx.compose.material3.ButtonDefaults.$stable
            int r181 = r0 << 12
            r182 = 14
            r174 = 0
            r176 = 0
            r178 = 0
            r180 = r3
            androidx.compose.material3.ButtonColors r175 = r171.m2121buttonColorsro_MJ88(r172, r174, r176, r178, r180, r181, r182)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r0 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function3 r180 = r0.getLambda$1526212165$app()
            r172 = 0
            r173 = 0
            r174 = 0
            r176 = 0
            r177 = 0
            r178 = 0
            r179 = 0
            r182 = 805306368(0x30000000, float:4.656613E-10)
            r183 = 494(0x1ee, float:6.92E-43)
            r181 = r3
            r171 = r6
            androidx.compose.material3.ButtonKt.Button(r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r3)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r156)
            r153.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r149)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r77)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r52)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r50)
            r39.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r39)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r38)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r27)
            r7.endReplaceGroup()
            r43 = r287
            r153 = r7
            r268 = r9
            r270 = r11
            r285 = r30
            r68 = r33
            r283 = r61
            r274 = r62
            r284 = r66
            r174 = r114
            r271 = r144
            r4 = r170
            r144 = r5
            r114 = r108
            r170 = r115
            r115 = r102
            r108 = r106
            r102 = r95
            r95 = r97
            r106 = r99
            r97 = r80
            r99 = r88
            r80 = r20
            r88 = r82
            r20 = r120
            r82 = r79
            r120 = r107
            r79 = r73
            r107 = r101
            r73 = r72
            r101 = r90
            r72 = r69
            r90 = r81
            r69 = r164
            r81 = r19
            r19 = r53
            goto L401b
        L22fc:
            r67 = r0
            r0 = -1597674460(0xffffffffa0c56c24, float:-3.344466E-19)
            r7.startReplaceGroup(r0)
            java.lang.String r0 = "560@32370L21,563@32492L31042"
            androidx.compose.runtime.ComposerKt.sourceInformation(r7, r0)
            r10 = 0
            r14 = 1
            androidx.compose.foundation.ScrollState r0 = androidx.compose.foundation.ScrollKt.rememberScrollState(r10, r7, r10, r14)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            r34 = r2
            androidx.compose.ui.Modifier r34 = (androidx.compose.ui.Modifier) r34
            r37 = 2
            r38 = 0
            r35 = 1065353216(0x3f800000, float:1.0)
            r36 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.ColumnScope.weight$default(r33, r34, r35, r36, r37, r38)
            r68 = r33
            r4 = 0
            r10 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r4, r14, r10)
            r14 = 16
            r15 = 0
            float r4 = (float) r14
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            r14 = 2
            r15 = 0
            androidx.compose.ui.Modifier r34 = androidx.compose.foundation.layout.PaddingKt.m818paddingVpY3zN4$default(r2, r4, r15, r14, r10)
            r39 = 14
            r40 = 0
            r37 = 0
            r38 = 0
            r35 = r0
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.ScrollKt.verticalScroll$default(r34, r35, r36, r37, r38, r39, r40)
            r146 = r35
            r59 = 0
            r147 = r59
            r10 = r7
            r148 = r0
            r149 = 0
            r0 = 1341605231(0x4ff7456f, float:8.2970455E9)
            java.lang.String r2 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r0, r2)
            androidx.compose.foundation.layout.Arrangement r0 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$Vertical r14 = r0.getTop()
            androidx.compose.ui.Alignment$Companion r0 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r15 = r0.getStart()
            int r0 = r147 >> 3
            r0 = r0 & 14
            int r2 = r147 >> 3
            r2 = r2 & 112(0x70, float:1.57E-43)
            r0 = r0 | r2
            androidx.compose.ui.layout.MeasurePolicy r150 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r14, r15, r10, r0)
            int r0 = r147 << 3
            r0 = r0 & 112(0x70, float:1.57E-43)
            r151 = r0
            r0 = r10
            r2 = r148
            r4 = r150
            r152 = 0
            r153 = r7
            r7 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r7, r3)
            r7 = 0
            long r33 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r7)
            int r154 = java.lang.Long.hashCode(r33)
            androidx.compose.runtime.CompositionLocalMap r7 = r0.getCurrentCompositionLocalMap()
            r155 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r33 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r33 = r33.getConstructor()
            r156 = r0
            int r0 = r151 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r157 = r33
            r158 = r0
            r0 = r156
            r159 = 0
            r160 = r2
            r2 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r2, r12)
            androidx.compose.runtime.Applier r2 = r0.getApplier()
            boolean r2 = r2 instanceof androidx.compose.runtime.Applier
            if (r2 != 0) goto L23c5
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L23c5:
            r0.startReusableNode()
            boolean r2 = r0.getInserting()
            if (r2 == 0) goto L23d4
            r2 = r157
            r0.createNode(r2)
            goto L23d9
        L23d4:
            r2 = r157
            r0.useNode()
        L23d9:
            r157 = r0
            androidx.compose.runtime.Composer r0 = androidx.compose.runtime.Updater.m4364constructorimpl(r157)
            r33 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r161 = r2
            kotlin.jvm.functions.Function2 r2 = r34.getSetMeasurePolicy()
            androidx.compose.runtime.Updater.m4372setimpl(r0, r4, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r2 = r2.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r0, r7, r2)
            java.lang.Integer r2 = java.lang.Integer.valueOf(r154)
            androidx.compose.ui.node.ComposeUiNode$Companion r34 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r162 = r4
            kotlin.jvm.functions.Function2 r4 = r34.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r0, r2, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r2 = r2.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r0, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r2 = r2.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r0, r10, r2)
            int r0 = r158 >> 6
            r163 = r0 & 14
            r0 = r157
            r165 = 0
            r2 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            java.lang.String r4 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r2, r4)
            androidx.compose.foundation.layout.ColumnScopeInstance r2 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r4 = r147 >> 6
            r4 = r4 & 112(0x70, float:1.57E-43)
            r63 = 6
            r166 = r4 | 6
            androidx.compose.foundation.layout.ColumnScope r2 = (androidx.compose.foundation.layout.ColumnScope) r2
            r4 = r0
            r167 = r2
            r168 = 0
            r2 = 1307025167(0x4de79f0f, float:4.8574512E8)
            r169 = r0
            java.lang.String r0 = "C570@32874L41,573@33014L89,574@33140L40,577@33361L37,579@33522L5054,575@33217L5359,636@38614L41,639@38750L92,640@38879L40,641@38956L2792,680@41786L41,683@41925L89,684@42051L40,685@42128L1927,713@44093L41,716@44236L93,717@44366L40,718@44443L1919,746@46400L41,749@46555L98,750@46690L40,751@46767L2929,857@54425L41,874@55763L37,876@55924L3192,872@55619L3497,922@59154L41,925@59287L4213:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r2, r0)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 12
            r33 = 0
            r265 = r7
            float r7 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r7)
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r0, r2)
            r7 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r0, r4, r7)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r0 = 11
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r0)
            androidx.compose.ui.text.font.FontWeight$Companion r0 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r0.getBold()
            r195 = 0
            r196 = 262058(0x3ffaa, float:3.67221E-40)
            java.lang.String r171 = "Bill Items"
            r172 = 0
            r175 = 0
            r178 = 0
            r180 = 0
            r181 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r194 = 1597446(0x186006, float:2.238499E-39)
            r193 = r4
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            r0 = r193
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 8
            r7 = 0
            r33 = r7
            float r7 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r7)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r0 = 1
            r4 = 0
            r7 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r4, r0, r7)
            androidx.compose.material3.CardDefaults r33 = androidx.compose.material3.CardDefaults.INSTANCE
            long r34 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            int r0 = androidx.compose.material3.CardDefaults.$stable
            int r43 = r0 << 12
            r44 = 14
            r36 = 0
            r38 = 0
            r40 = 0
            r42 = r193
            androidx.compose.material3.CardColors r35 = r33.m2141cardColorsro_MJ88(r34, r36, r38, r40, r42, r43, r44)
            r0 = r42
            r4 = 1
            r7 = 0
            r33 = r2
            float r2 = (float) r4
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r2)
            r7 = r14
            r266 = r15
            long r14 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.foundation.BorderStroke r37 = androidx.compose.foundation.BorderStrokeKt.m288BorderStrokecXLIe8U(r2, r14)
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda36 r2 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda36
            r2.<init>()
            r4 = -349710112(0xffffffffeb27d8e0, float:-2.0291478E26)
            r14 = 54
            r15 = 1
            androidx.compose.runtime.internal.ComposableLambda r2 = androidx.compose.runtime.internal.ComposableLambdaKt.rememberComposableLambda(r4, r15, r2, r0, r14)
            r38 = r2
            kotlin.jvm.functions.Function3 r38 = (kotlin.jvm.functions.Function3) r38
            r34 = 0
            r36 = 0
            r40 = 196614(0x30006, float:2.75515E-40)
            r41 = 10
            r39 = r0
            androidx.compose.material3.CardKt.Card(r33, r34, r35, r36, r37, r38, r39, r40, r41)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 16
            r14 = 0
            float r15 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r15)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r2 = 11
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r2.getBold()
            java.lang.String r171 = "Customer Info"
            r193 = r0
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 8
            r14 = 0
            float r15 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r15)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 0
            r14 = 0
            r15 = 1
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r14, r15, r4)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r14 = 8
            r15 = 0
            r33 = r2
            float r2 = (float) r14
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r2)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r2 = r4.m686spacedBy0680j_4(r2)
            androidx.compose.foundation.layout.Arrangement$Horizontal r2 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r2
            r4 = r0
            r74 = 54
            r14 = r74
            r15 = 0
            r267 = r7
            r7 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r7, r13)
            androidx.compose.ui.Alignment$Companion r7 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r7 = r7.getTop()
            int r34 = r14 >> 3
            r34 = r34 & 14
            int r35 = r14 >> 3
            r35 = r35 & 112(0x70, float:1.57E-43)
            r268 = r9
            r9 = r34 | r35
            androidx.compose.ui.layout.MeasurePolicy r9 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r2, r7, r4, r9)
            int r34 = r14 << 3
            r34 = r34 & 112(0x70, float:1.57E-43)
            r35 = r33
            r36 = r9
            r37 = r4
            r38 = 0
            r39 = r2
            r2 = r37
            r4 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r4, r3)
            r4 = 0
            long r40 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r4)
            int r4 = java.lang.Long.hashCode(r40)
            r40 = r4
            androidx.compose.runtime.CompositionLocalMap r4 = r2.getCurrentCompositionLocalMap()
            r41 = r7
            r7 = r35
            r35 = r9
            androidx.compose.ui.Modifier r9 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r42 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r42 = r42.getConstructor()
            r43 = r2
            int r2 = r34 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r44 = r42
            r42 = r43
            r45 = 0
            r46 = r7
            r269 = r10
            r7 = r42
            r10 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r10, r12)
            androidx.compose.runtime.Applier r10 = r7.getApplier()
            boolean r10 = r10 instanceof androidx.compose.runtime.Applier
            if (r10 != 0) goto L25eb
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L25eb:
            r7.startReusableNode()
            boolean r10 = r7.getInserting()
            if (r10 == 0) goto L25fa
            r10 = r44
            r7.createNode(r10)
            goto L25ff
        L25fa:
            r10 = r44
            r7.useNode()
        L25ff:
            r42 = r7
            androidx.compose.runtime.Composer r7 = androidx.compose.runtime.Updater.m4364constructorimpl(r42)
            r44 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r47 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r48 = r10
            kotlin.jvm.functions.Function2 r10 = r47.getSetMeasurePolicy()
            r270 = r11
            r11 = r36
            androidx.compose.runtime.Updater.m4372setimpl(r7, r11, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r10 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r10 = r10.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r7, r4, r10)
            java.lang.Integer r10 = java.lang.Integer.valueOf(r40)
            androidx.compose.ui.node.ComposeUiNode$Companion r36 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r47 = r4
            kotlin.jvm.functions.Function2 r4 = r36.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r7, r10, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r7, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r7, r9, r4)
            int r4 = r2 >> 6
            r4 = r4 & 14
            r7 = r42
            r10 = 0
            r36 = r2
            r2 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r2, r8)
            androidx.compose.foundation.layout.RowScopeInstance r2 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r44 = r14 >> 6
            r44 = r44 & 112(0x70, float:1.57E-43)
            r63 = 6
            r44 = r44 | 6
            androidx.compose.foundation.layout.RowScope r2 = (androidx.compose.foundation.layout.RowScope) r2
            r257 = r7
            r49 = 0
            r50 = r2
            r2 = -1088030129(0xffffffffbf25fa4f, float:-0.64835066)
            r51 = r4
            java.lang.String r4 = "C650@39635L548,647@39353L21,645@39208L1172,667@40965L548,663@40567L22,661@40421L1289:BillingScreen.kt#7ez3px"
            r52 = r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r2, r4)
            java.lang.String r2 = BillingScreen$lambda$18(r170)
            androidx.compose.material3.OutlinedTextFieldDefaults r171 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r193 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r195 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r4 = androidx.compose.ui.graphics.Color.INSTANCE
            long r172 = r4.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r4 = androidx.compose.ui.graphics.Color.INSTANCE
            long r174 = r4.m5131getWhite0d7_KjU()
            long r180 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r182 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r176 = 0
            r178 = 0
            r184 = 0
            r186 = 0
            r188 = 0
            r190 = 0
            r192 = 0
            r197 = 0
            r199 = 0
            r201 = 0
            r203 = 0
            r205 = 0
            r207 = 0
            r209 = 0
            r211 = 0
            r213 = 0
            r215 = 0
            r217 = 0
            r219 = 0
            r221 = 0
            r223 = 0
            r225 = 0
            r227 = 0
            r229 = 0
            r231 = 0
            r233 = 0
            r235 = 0
            r237 = 0
            r239 = 0
            r241 = 0
            r243 = 0
            r245 = 0
            r247 = 0
            r249 = 0
            r251 = 0
            r253 = 0
            r16 = 0
            r255 = 54
            r4 = 0
            r259 = r4
            r260 = r4
            r261 = r4
            r4 = 3072(0xc00, float:4.305E-42)
            r262 = r4
            r4 = 2147477452(0x7fffe7cc, float:NaN)
            r263 = r4
            r4 = 4095(0xfff, float:5.738E-42)
            r264 = r4
            r258 = r255
            r255 = r16
            androidx.compose.material3.TextFieldColors r193 = r171.m2705colors0hiis_0(r172, r174, r176, r178, r180, r182, r184, r186, r188, r190, r192, r193, r195, r197, r199, r201, r203, r205, r207, r209, r211, r213, r215, r217, r219, r221, r223, r225, r227, r229, r231, r233, r235, r237, r239, r241, r243, r245, r247, r249, r251, r253, r255, r257, r258, r259, r260, r261, r262, r263, r264)
            r4 = 10
            r16 = 0
            r17 = r2
            float r2 = (float) r4
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r2)
            androidx.compose.foundation.shape.RoundedCornerShape r2 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r2)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            r172 = r4
            androidx.compose.ui.Modifier r172 = (androidx.compose.ui.Modifier) r172
            r175 = 2
            r176 = 0
            r173 = 1065353216(0x3f800000, float:1.0)
            r174 = 0
            r171 = r50
            androidx.compose.ui.Modifier r173 = androidx.compose.foundation.layout.RowScope.weight$default(r171, r172, r173, r174, r175, r176)
            r4 = -1974758237(0xffffffff8a4b94a3, float:-9.80205E-33)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r4, r6)
            r4 = r170
            boolean r16 = r7.changed(r4)
            r170 = r7
            r171 = 0
            java.lang.Object r7 = r170.rememberedValue()
            r172 = 0
            if (r16 != 0) goto L2755
            androidx.compose.runtime.Composer$Companion r174 = androidx.compose.runtime.Composer.INSTANCE
            r273 = r9
            java.lang.Object r9 = r174.getEmpty()
            if (r7 != r9) goto L2752
            goto L2758
        L2752:
            r9 = r170
            goto L2767
        L2755:
            r273 = r9
        L2758:
            r9 = 0
            r174 = r7
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda37 r7 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda37
            r7.<init>()
            r9 = r170
            r9.updateRememberedValue(r7)
        L2767:
            r172 = r7
            kotlin.jvm.functions.Function1 r172 = (kotlin.jvm.functions.Function1) r172
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r257)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r7 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r178 = r7.getLambda$2144152213$app()
            r192 = r2
            androidx.compose.ui.graphics.Shape r192 = (androidx.compose.ui.graphics.Shape) r192
            r174 = 0
            r175 = 0
            r176 = 0
            r177 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r186 = 0
            r187 = 0
            r188 = 1
            r189 = 0
            r190 = 0
            r191 = 0
            r195 = 12582912(0xc00000, float:1.7632415E-38)
            r196 = 12582912(0xc00000, float:1.7632415E-38)
            r197 = 0
            r198 = 1965944(0x1dff78, float:2.754874E-39)
            r171 = r17
            r194 = r257
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            java.lang.String r2 = BillingScreen$lambda$21(r144)
            androidx.compose.foundation.text.KeyboardOptions r170 = new androidx.compose.foundation.text.KeyboardOptions
            androidx.compose.ui.text.input.KeyboardType$Companion r7 = androidx.compose.ui.text.input.KeyboardType.INSTANCE
            int r173 = r7.m7566getPhonePjHm6EE()
            r178 = 123(0x7b, float:1.72E-43)
            r171 = 0
            r172 = 0
            r175 = 0
            r170.<init>(r171, r172, r173, r174, r175, r176, r177, r178, r179)
            androidx.compose.material3.OutlinedTextFieldDefaults r171 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r193 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r195 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r7 = androidx.compose.ui.graphics.Color.INSTANCE
            long r172 = r7.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r7 = androidx.compose.ui.graphics.Color.INSTANCE
            long r174 = r7.m5131getWhite0d7_KjU()
            long r180 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r182 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r176 = 0
            r178 = 0
            r184 = 0
            r186 = 0
            r188 = 0
            r190 = 0
            r192 = 0
            r197 = 0
            r199 = 0
            r201 = 0
            r203 = 0
            r205 = 0
            r207 = 0
            r209 = 0
            r211 = 0
            r213 = 0
            r215 = 0
            r217 = 0
            r219 = 0
            r221 = 0
            r223 = 0
            r225 = 0
            r227 = 0
            r229 = 0
            r231 = 0
            r233 = 0
            r235 = 0
            r237 = 0
            r239 = 0
            r241 = 0
            r243 = 0
            r245 = 0
            r247 = 0
            r249 = 0
            r251 = 0
            r253 = 0
            r16 = 0
            r7 = 54
            r9 = 0
            r255 = 0
            r258 = r7
            r7 = 0
            r261 = r7
            r7 = 3072(0xc00, float:4.305E-42)
            r262 = r7
            r7 = 2147477452(0x7fffe7cc, float:NaN)
            r263 = r7
            r7 = 4095(0xfff, float:5.738E-42)
            r264 = r7
            r259 = r9
            r260 = r255
            r255 = r16
            androidx.compose.material3.TextFieldColors r193 = r171.m2705colors0hiis_0(r172, r174, r176, r178, r180, r182, r184, r186, r188, r190, r192, r193, r195, r197, r199, r201, r203, r205, r207, r209, r211, r213, r215, r217, r219, r221, r223, r225, r227, r229, r231, r233, r235, r237, r239, r241, r243, r245, r247, r249, r251, r253, r255, r257, r258, r259, r260, r261, r262, r263, r264)
            r7 = r257
            r9 = 10
            r16 = 0
            r17 = r2
            float r2 = (float) r9
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r2)
            androidx.compose.foundation.shape.RoundedCornerShape r2 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r2)
            androidx.compose.ui.Modifier$Companion r9 = androidx.compose.ui.Modifier.INSTANCE
            r172 = r9
            androidx.compose.ui.Modifier r172 = (androidx.compose.ui.Modifier) r172
            r175 = 2
            r176 = 0
            r173 = 1065353216(0x3f800000, float:1.0)
            r174 = 0
            r171 = r50
            androidx.compose.ui.Modifier r173 = androidx.compose.foundation.layout.RowScope.weight$default(r171, r172, r173, r174, r175, r176)
            r9 = -1974719388(0xffffffff8a4c2c64, float:-9.830592E-33)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r9, r6)
            r9 = r144
            boolean r16 = r7.changed(r9)
            r144 = r7
            r171 = 0
            java.lang.Object r7 = r144.rememberedValue()
            r172 = 0
            if (r16 != 0) goto L28a8
            androidx.compose.runtime.Composer$Companion r174 = androidx.compose.runtime.Composer.INSTANCE
            r199 = r10
            java.lang.Object r10 = r174.getEmpty()
            if (r7 != r10) goto L28a5
            goto L28aa
        L28a5:
            r10 = r144
            goto L28b9
        L28a8:
            r199 = r10
        L28aa:
            r10 = 0
            r174 = r7
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda39 r7 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda39
            r7.<init>()
            r10 = r144
            r10.updateRememberedValue(r7)
        L28b9:
            r172 = r7
            kotlin.jvm.functions.Function1 r172 = (kotlin.jvm.functions.Function1) r172
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r257)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r7 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r178 = r7.m8427getLambda$1660483586$app()
            r192 = r2
            androidx.compose.ui.graphics.Shape r192 = (androidx.compose.ui.graphics.Shape) r192
            r174 = 0
            r175 = 0
            r176 = 0
            r177 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 1
            r189 = 0
            r190 = 0
            r191 = 0
            r195 = 12582912(0xc00000, float:1.7632415E-38)
            r196 = 12779520(0xc30000, float:1.7907922E-38)
            r197 = 0
            r198 = 1933176(0x1d7f78, float:2.708957E-39)
            r171 = r17
            r186 = r170
            r194 = r257
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r257)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r52)
            r42.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r42)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r43)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r37)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r7 = 16
            r10 = 0
            float r11 = (float) r7
            float r7 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r7)
            r7 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r7)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r2 = 11
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r2.getBold()
            r195 = 0
            r196 = 262058(0x3ffaa, float:3.67221E-40)
            java.lang.String r171 = "Order Type"
            r172 = 0
            r175 = 0
            r178 = 0
            r181 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r192 = 0
            r194 = 1597446(0x186006, float:2.238499E-39)
            r193 = r0
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r7 = 6
            r10 = 0
            float r11 = (float) r7
            float r7 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r7)
            r7 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r7)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r7 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r14, r10, r7)
            androidx.compose.foundation.layout.Arrangement r7 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r10 = 6
            r11 = 0
            float r14 = (float) r10
            float r10 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r7 = r7.m686spacedBy0680j_4(r10)
            androidx.compose.foundation.layout.Arrangement$Horizontal r7 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r7
            r10 = r0
            r74 = 54
            r11 = r74
            r14 = 0
            r15 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r15, r13)
            androidx.compose.ui.Alignment$Companion r15 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r15 = r15.getTop()
            int r16 = r11 >> 3
            r16 = r16 & 14
            int r17 = r11 >> 3
            r17 = r17 & 112(0x70, float:1.57E-43)
            r33 = r2
            r2 = r16 | r17
            androidx.compose.ui.layout.MeasurePolicy r2 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r7, r15, r10, r2)
            int r16 = r11 << 3
            r16 = r16 & 112(0x70, float:1.57E-43)
            r34 = r33
            r35 = r2
            r36 = r10
            r37 = r16
            r38 = 0
            r39 = r2
            r2 = r36
            r36 = r7
            r7 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r7, r3)
            r7 = 0
            long r40 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r7)
            int r7 = java.lang.Long.hashCode(r40)
            r40 = r7
            androidx.compose.runtime.CompositionLocalMap r7 = r2.getCurrentCompositionLocalMap()
            r41 = r10
            r10 = r34
            r34 = r14
            androidx.compose.ui.Modifier r14 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r16 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r16 = r16.getConstructor()
            r42 = r2
            int r2 = r37 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r43 = r16
            r44 = r42
            r45 = 0
            r46 = r10
            r10 = r44
            r44 = r15
            r15 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r15, r12)
            androidx.compose.runtime.Applier r15 = r10.getApplier()
            boolean r15 = r15 instanceof androidx.compose.runtime.Applier
            if (r15 != 0) goto L2a0e
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L2a0e:
            r10.startReusableNode()
            boolean r15 = r10.getInserting()
            if (r15 == 0) goto L2a1d
            r15 = r43
            r10.createNode(r15)
            goto L2a22
        L2a1d:
            r15 = r43
            r10.useNode()
        L2a22:
            r43 = r10
            androidx.compose.runtime.Composer r10 = androidx.compose.runtime.Updater.m4364constructorimpl(r43)
            r16 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r47 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r48 = r15
            kotlin.jvm.functions.Function2 r15 = r47.getSetMeasurePolicy()
            r144 = r5
            r5 = r35
            androidx.compose.runtime.Updater.m4372setimpl(r10, r5, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r15 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r15 = r15.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r10, r7, r15)
            java.lang.Integer r15 = java.lang.Integer.valueOf(r40)
            androidx.compose.ui.node.ComposeUiNode$Companion r35 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r47 = r5
            kotlin.jvm.functions.Function2 r5 = r35.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r10, r15, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r5 = r5.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r10, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r5 = r5.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r10, r14, r5)
            int r5 = r2 >> 6
            r5 = r5 & 14
            r10 = r43
            r15 = 0
            r35 = r2
            r2 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r2, r8)
            androidx.compose.foundation.layout.RowScopeInstance r2 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r16 = r11 >> 6
            r16 = r16 & 112(0x70, float:1.57E-43)
            r63 = 6
            r49 = r16 | 6
            androidx.compose.foundation.layout.RowScope r2 = (androidx.compose.foundation.layout.RowScope) r2
            r50 = r10
            r170 = r2
            r2 = 0
            r51 = r2
            r2 = 1895893255(0x71010907, float:6.389517E29)
            r52 = r5
            java.lang.String r5 = "C:BillingScreen.kt#7ez3px"
            r176 = r7
            r7 = r50
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r2, r5)
            r2 = 4
            java.lang.String[] r2 = new java.lang.String[r2]
            java.lang.String r5 = "DINE-IN"
            r59 = 0
            r2[r59] = r5
            java.lang.String r5 = "TAKEAWAY"
            r58 = 1
            r2[r58] = r5
            java.lang.String r5 = "DELIVERY"
            r32 = 2
            r2[r32] = r5
            java.lang.String r5 = "PRE-ORDER"
            r50 = 3
            r2[r50] = r5
            java.util.List r2 = kotlin.collections.CollectionsKt.listOf(r2)
            r5 = 1308087649(0x4df7d561, float:5.19744544E8)
            r7.startReplaceGroup(r5)
            java.lang.String r5 = "*698@43171L20,692@42644L1331"
            androidx.compose.runtime.ComposerKt.sourceInformation(r7, r5)
            r5 = r2
            java.lang.Iterable r5 = (java.lang.Iterable) r5
            r177 = 0
            java.util.Iterator r178 = r5.iterator()
        L2ac8:
            boolean r16 = r178.hasNext()
            if (r16 == 0) goto L2d3c
            java.lang.Object r179 = r178.next()
            r186 = r2
            r2 = r179
            java.lang.String r2 = (java.lang.String) r2
            r187 = 0
            r188 = r5
            java.lang.String r5 = BillingScreen$lambda$24(r53)
            boolean r5 = kotlin.jvm.internal.Intrinsics.areEqual(r5, r2)
            androidx.compose.ui.Modifier$Companion r16 = androidx.compose.ui.Modifier.INSTANCE
            r171 = r16
            androidx.compose.ui.Modifier r171 = (androidx.compose.ui.Modifier) r171
            r174 = 2
            r175 = 0
            r172 = 1065353216(0x3f800000, float:1.0)
            r173 = 0
            r189 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.foundation.layout.RowScope.weight$default(r170, r171, r172, r173, r174, r175)
            r171 = r11
            r11 = 8
            r16 = 0
            r172 = r14
            float r14 = (float) r11
            float r11 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            androidx.compose.foundation.shape.RoundedCornerShape r11 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r11)
            androidx.compose.ui.graphics.Shape r11 = (androidx.compose.ui.graphics.Shape) r11
            androidx.compose.ui.Modifier r180 = androidx.compose.ui.draw.ClipKt.clip(r10, r11)
            if (r5 == 0) goto L2b16
            long r10 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            goto L2b1a
        L2b16:
            long r10 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
        L2b1a:
            r181 = r10
            r184 = 2
            r185 = 0
            r183 = 0
            androidx.compose.ui.Modifier r10 = androidx.compose.foundation.BackgroundKt.m262backgroundbw27NRU$default(r180, r181, r183, r184, r185)
            r11 = 1
            r14 = 0
            r16 = r14
            float r14 = (float) r11
            float r11 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            if (r5 == 0) goto L2b36
            long r173 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            goto L2b3a
        L2b36:
            long r173 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
        L2b3a:
            r175 = r15
            r14 = r173
            r271 = r9
            r9 = 8
            r16 = 0
            r273 = r4
            float r4 = (float) r9
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.foundation.shape.RoundedCornerShape r4 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r4)
            androidx.compose.ui.graphics.Shape r4 = (androidx.compose.ui.graphics.Shape) r4
            androidx.compose.ui.Modifier r190 = androidx.compose.foundation.BorderKt.m273borderxT4_qwU(r10, r11, r14, r4)
            r4 = -2069319909(0xffffffff84a8af1b, float:-3.965742E-36)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r4, r6)
            r4 = r53
            boolean r9 = r7.changed(r4)
            boolean r10 = r7.changed(r2)
            r9 = r9 | r10
            r10 = r7
            r11 = 0
            java.lang.Object r14 = r10.rememberedValue()
            r15 = 0
            if (r9 != 0) goto L2b7d
            androidx.compose.runtime.Composer$Companion r16 = androidx.compose.runtime.Composer.INSTANCE
            r53 = r7
            java.lang.Object r7 = r16.getEmpty()
            if (r14 != r7) goto L2b7c
            goto L2b7f
        L2b7c:
            goto L2b8c
        L2b7d:
            r53 = r7
        L2b7f:
            r7 = 0
            r16 = r7
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda40 r7 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda40
            r7.<init>()
            r10.updateRememberedValue(r7)
            r14 = r7
        L2b8c:
            r195 = r14
            kotlin.jvm.functions.Function0 r195 = (kotlin.jvm.functions.Function0) r195
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r53)
            r196 = 15
            r197 = 0
            r191 = 0
            r192 = 0
            r193 = 0
            r194 = 0
            androidx.compose.ui.Modifier r7 = androidx.compose.foundation.ClickableKt.m297clickableoSLSa3U$default(r190, r191, r192, r193, r194, r195, r196, r197)
            r9 = 8
            r10 = 0
            float r11 = (float) r9
            float r9 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            r10 = 0
            r14 = 0
            r15 = 1
            androidx.compose.ui.Modifier r7 = androidx.compose.foundation.layout.PaddingKt.m818paddingVpY3zN4$default(r7, r14, r9, r15, r10)
            androidx.compose.ui.Alignment$Companion r9 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r9 = r9.getCenter()
            r10 = r53
            r11 = 48
            r14 = 0
            java.lang.String r15 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r180 = r2
            r2 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r2, r15)
            r2 = 0
            androidx.compose.ui.layout.MeasurePolicy r15 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r9, r2)
            int r173 = r11 << 3
            r173 = r173 & 112(0x70, float:1.57E-43)
            r174 = r10
            r190 = r7
            r191 = r15
            r192 = 0
            r193 = r2
            r272 = r4
            r2 = r174
            r4 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r4, r3)
            r4 = 0
            long r181 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r4)
            int r4 = java.lang.Long.hashCode(r181)
            r174 = r4
            androidx.compose.runtime.CompositionLocalMap r4 = r2.getCurrentCompositionLocalMap()
            r194 = r7
            r190 = r9
            androidx.compose.ui.Modifier r9 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r181 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r181 = r181.getConstructor()
            r195 = r2
            int r2 = r173 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r196 = r195
            r197 = r181
            r198 = 0
            r199 = r7
            r7 = r196
            r196 = r10
            r10 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r10, r12)
            androidx.compose.runtime.Applier r10 = r7.getApplier()
            boolean r10 = r10 instanceof androidx.compose.runtime.Applier
            if (r10 != 0) goto L2c2c
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L2c2c:
            r7.startReusableNode()
            boolean r10 = r7.getInserting()
            if (r10 == 0) goto L2c3b
            r10 = r197
            r7.createNode(r10)
            goto L2c40
        L2c3b:
            r10 = r197
            r7.useNode()
        L2c40:
            r197 = r7
            androidx.compose.runtime.Composer r7 = androidx.compose.runtime.Updater.m4364constructorimpl(r197)
            r181 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r182 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r200 = r10
            kotlin.jvm.functions.Function2 r10 = r182.getSetMeasurePolicy()
            r201 = r14
            r14 = r191
            androidx.compose.runtime.Updater.m4372setimpl(r7, r14, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r10 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r10 = r10.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r7, r4, r10)
            java.lang.Integer r10 = java.lang.Integer.valueOf(r174)
            androidx.compose.ui.node.ComposeUiNode$Companion r182 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r191 = r4
            kotlin.jvm.functions.Function2 r4 = r182.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r7, r10, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r7, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r7, r9, r4)
            int r4 = r2 >> 6
            r4 = r4 & 14
            r7 = r197
            r10 = 0
            r202 = r2
            r2 = 1833054614(0x6d423196, float:3.7562524E27)
            r203 = r4
            java.lang.String r4 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r2, r4)
            androidx.compose.foundation.layout.BoxScopeInstance r2 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r4 = r11 >> 6
            r4 = r4 & 112(0x70, float:1.57E-43)
            r63 = 6
            r4 = r4 | 6
            androidx.compose.foundation.layout.BoxScope r2 = (androidx.compose.foundation.layout.BoxScope) r2
            r226 = r7
            r230 = 0
            r231 = r2
            r2 = -207782728(0xfffffffff39d7cb8, float:-2.495484E31)
            r232 = r4
            java.lang.String r4 = "C702@43451L478:BillingScreen.kt#7ez3px"
            r233 = r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r2, r4)
            r184 = 4
            r185 = 0
            java.lang.String r181 = "-"
            java.lang.String r182 = " "
            r183 = 0
            java.lang.String r204 = kotlin.text.StringsKt.replace$default(r180, r181, r182, r183, r184, r185)
            if (r5 == 0) goto L2ccb
            androidx.compose.ui.graphics.Color$Companion r2 = androidx.compose.ui.graphics.Color.INSTANCE
            long r181 = r2.m5131getWhite0d7_KjU()
            goto L2ccf
        L2ccb:
            long r181 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
        L2ccf:
            r206 = r181
            r2 = 9
            long r209 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r212 = r2.getBold()
            androidx.compose.ui.text.style.TextAlign$Companion r2 = androidx.compose.ui.text.style.TextAlign.INSTANCE
            int r2 = r2.m7755getCentere0LSkKk()
            androidx.compose.ui.text.style.TextAlign r217 = androidx.compose.ui.text.style.TextAlign.m7748boximpl(r2)
            r205 = 0
            r208 = 0
            r211 = 0
            r213 = 0
            r214 = 0
            r216 = 0
            r218 = 0
            r220 = 0
            r221 = 0
            r222 = 0
            r223 = 0
            r224 = 0
            r225 = 0
            r227 = 1597440(0x186000, float:2.23849E-39)
            r228 = 0
            r229 = 261034(0x3fbaa, float:3.65787E-40)
            r226 = r7
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r204, r205, r206, r208, r209, r211, r212, r213, r214, r216, r217, r218, r220, r221, r222, r223, r224, r225, r226, r227, r228, r229)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r226)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r233)
            r197.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r197)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r195)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r196)
            r7 = r53
            r11 = r171
            r14 = r172
            r15 = r175
            r2 = r186
            r5 = r188
            r10 = r189
            r9 = r271
            r53 = r272
            r4 = r273
            goto L2ac8
        L2d3c:
            r186 = r2
            r273 = r4
            r188 = r5
            r271 = r9
            r189 = r10
            r171 = r11
            r172 = r14
            r175 = r15
            r272 = r53
            r53 = r7
            r53.endReplaceGroup()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r53)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r189)
            r43.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r43)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r42)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r41)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 16
            r5 = 0
            float r7 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r7)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r2 = 11
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r2.getBold()
            r195 = 0
            r196 = 262058(0x3ffaa, float:3.67221E-40)
            java.lang.String r171 = "Payment Method"
            r172 = 0
            r175 = 0
            r178 = 0
            r180 = 0
            r181 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r194 = 1597446(0x186006, float:2.238499E-39)
            r193 = r0
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 6
            r5 = 0
            float r7 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r7)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r9 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r14, r10, r9)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r5 = 6
            r7 = 0
            float r9 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r9)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r4 = r4.m686spacedBy0680j_4(r5)
            androidx.compose.foundation.layout.Arrangement$Horizontal r4 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r4
            r5 = r0
            r74 = 54
            r7 = r74
            r9 = 0
            r11 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r11, r13)
            androidx.compose.ui.Alignment$Companion r10 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r10 = r10.getTop()
            int r11 = r7 >> 3
            r11 = r11 & 14
            int r14 = r7 >> 3
            r14 = r14 & 112(0x70, float:1.57E-43)
            r11 = r11 | r14
            androidx.compose.ui.layout.MeasurePolicy r11 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r4, r10, r5, r11)
            int r14 = r7 << 3
            r14 = r14 & 112(0x70, float:1.57E-43)
            r15 = r2
            r33 = r11
            r34 = r5
            r35 = 0
            r36 = r2
            r2 = r34
            r34 = r4
            r4 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r4, r3)
            r4 = 0
            long r37 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r4)
            int r4 = java.lang.Long.hashCode(r37)
            r37 = r4
            androidx.compose.runtime.CompositionLocalMap r4 = r2.getCurrentCompositionLocalMap()
            r38 = r5
            androidx.compose.ui.Modifier r5 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r39 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r39 = r39.getConstructor()
            r40 = r2
            int r2 = r14 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r41 = r39
            r39 = r40
            r42 = 0
            r43 = r9
            r9 = r39
            r39 = r10
            r10 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r10, r12)
            androidx.compose.runtime.Applier r10 = r9.getApplier()
            boolean r10 = r10 instanceof androidx.compose.runtime.Applier
            if (r10 != 0) goto L2e64
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L2e64:
            r9.startReusableNode()
            boolean r10 = r9.getInserting()
            if (r10 == 0) goto L2e73
            r10 = r41
            r9.createNode(r10)
            goto L2e78
        L2e73:
            r10 = r41
            r9.useNode()
        L2e78:
            r41 = r9
            androidx.compose.runtime.Composer r9 = androidx.compose.runtime.Updater.m4364constructorimpl(r41)
            r44 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r45 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r46 = r10
            kotlin.jvm.functions.Function2 r10 = r45.getSetMeasurePolicy()
            r45 = r11
            r11 = r33
            androidx.compose.runtime.Updater.m4372setimpl(r9, r11, r10)
            androidx.compose.ui.node.ComposeUiNode$Companion r10 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r10 = r10.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r4, r10)
            java.lang.Integer r10 = java.lang.Integer.valueOf(r37)
            androidx.compose.ui.node.ComposeUiNode$Companion r33 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r47 = r4
            kotlin.jvm.functions.Function2 r4 = r33.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r9, r10, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r9, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r5, r4)
            int r4 = r2 >> 6
            r4 = r4 & 14
            r9 = r41
            r10 = 0
            r33 = r2
            r2 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r8)
            androidx.compose.foundation.layout.RowScopeInstance r2 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r44 = r7 >> 6
            r44 = r44 & 112(0x70, float:1.57E-43)
            r63 = 6
            r44 = r44 | 6
            androidx.compose.foundation.layout.RowScope r2 = (androidx.compose.foundation.layout.RowScope) r2
            r48 = r9
            r170 = r2
            r2 = 0
            r49 = r2
            r2 = 1437257488(0x55aacf10, float:2.34757879E13)
            r51 = r4
            java.lang.String r4 = "C:BillingScreen.kt#7ez3px"
            r52 = r5
            r5 = r48
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r2, r4)
            r2 = 4
            java.lang.String[] r2 = new java.lang.String[r2]
            java.lang.String r4 = "CASH"
            r59 = 0
            r2[r59] = r4
            java.lang.String r4 = "UPI"
            r58 = 1
            r2[r58] = r4
            java.lang.String r4 = "CARD"
            r32 = 2
            r2[r32] = r4
            java.lang.String r4 = "CREDIT"
            r2[r50] = r4
            java.util.List r2 = kotlin.collections.CollectionsKt.listOf(r2)
            r4 = -1754748577(0xffffffff9768a95f, float:-7.517702E-25)
            r5.startReplaceGroup(r4)
            java.lang.String r4 = "*731@45487L26,725@44960L1322"
            androidx.compose.runtime.ComposerKt.sourceInformation(r5, r4)
            r4 = r2
            java.lang.Iterable r4 = (java.lang.Iterable) r4
            r32 = 0
            java.util.Iterator r48 = r4.iterator()
        L2f1c:
            boolean r50 = r48.hasNext()
            if (r50 == 0) goto L3180
            java.lang.Object r50 = r48.next()
            r53 = r2
            r2 = r50
            java.lang.String r2 = (java.lang.String) r2
            r197 = 0
            r198 = r4
            java.lang.String r4 = BillingScreen$lambda$27(r70)
            boolean r4 = kotlin.jvm.internal.Intrinsics.areEqual(r4, r2)
            androidx.compose.ui.Modifier$Companion r171 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r171 = (androidx.compose.ui.Modifier) r171
            r174 = 2
            r175 = 0
            r172 = 1065353216(0x3f800000, float:1.0)
            r173 = 0
            r199 = r7
            androidx.compose.ui.Modifier r7 = androidx.compose.foundation.layout.RowScope.weight$default(r170, r171, r172, r173, r174, r175)
            r200 = r9
            r9 = 8
            r171 = 0
            r201 = r10
            float r10 = (float) r9
            float r9 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.foundation.shape.RoundedCornerShape r9 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r9)
            androidx.compose.ui.graphics.Shape r9 = (androidx.compose.ui.graphics.Shape) r9
            androidx.compose.ui.Modifier r171 = androidx.compose.ui.draw.ClipKt.clip(r7, r9)
            if (r4 == 0) goto L2f68
            long r9 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            goto L2f6c
        L2f68:
            long r9 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
        L2f6c:
            r172 = r9
            r175 = 2
            r176 = 0
            r174 = 0
            androidx.compose.ui.Modifier r7 = androidx.compose.foundation.BackgroundKt.m262backgroundbw27NRU$default(r171, r172, r174, r175, r176)
            r9 = 1
            r10 = 0
            r171 = r10
            float r10 = (float) r9
            float r9 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            if (r4 == 0) goto L2f88
            long r171 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            goto L2f8c
        L2f88:
            long r171 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
        L2f8c:
            r202 = r11
            r10 = r171
            r203 = r14
            r14 = 8
            r171 = 0
            r204 = r15
            float r15 = (float) r14
            float r14 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r15)
            androidx.compose.foundation.shape.RoundedCornerShape r14 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r14)
            androidx.compose.ui.graphics.Shape r14 = (androidx.compose.ui.graphics.Shape) r14
            androidx.compose.ui.Modifier r171 = androidx.compose.foundation.BorderKt.m273borderxT4_qwU(r7, r9, r10, r14)
            r7 = -837188352(0xffffffffce198500, float:-6.4390758E8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r7, r6)
            r7 = r70
            boolean r9 = r5.changed(r7)
            boolean r10 = r5.changed(r2)
            r9 = r9 | r10
            r10 = r5
            r11 = 0
            java.lang.Object r14 = r10.rememberedValue()
            r15 = 0
            if (r9 != 0) goto L2fcd
            androidx.compose.runtime.Composer$Companion r70 = androidx.compose.runtime.Composer.INSTANCE
            r205 = r5
            java.lang.Object r5 = r70.getEmpty()
            if (r14 != r5) goto L2fcc
            goto L2fcf
        L2fcc:
            goto L2fdc
        L2fcd:
            r205 = r5
        L2fcf:
            r5 = 0
            r70 = r5
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda41 r5 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda41
            r5.<init>()
            r10.updateRememberedValue(r5)
            r14 = r5
        L2fdc:
            r176 = r14
            kotlin.jvm.functions.Function0 r176 = (kotlin.jvm.functions.Function0) r176
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r205)
            r177 = 15
            r178 = 0
            r172 = 0
            r173 = 0
            r174 = 0
            r175 = 0
            androidx.compose.ui.Modifier r5 = androidx.compose.foundation.ClickableKt.m297clickableoSLSa3U$default(r171, r172, r173, r174, r175, r176, r177, r178)
            r9 = 8
            r10 = 0
            float r11 = (float) r9
            float r9 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            r10 = 0
            r14 = 0
            r15 = 1
            androidx.compose.ui.Modifier r5 = androidx.compose.foundation.layout.PaddingKt.m818paddingVpY3zN4$default(r5, r14, r9, r15, r10)
            androidx.compose.ui.Alignment$Companion r9 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r9 = r9.getCenter()
            r10 = r205
            r11 = 48
            r14 = 0
            java.lang.String r15 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r171 = r2
            r2 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r2, r15)
            r2 = 0
            androidx.compose.ui.layout.MeasurePolicy r15 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r9, r2)
            int r70 = r11 << 3
            r70 = r70 & 112(0x70, float:1.57E-43)
            r206 = r10
            r207 = r5
            r208 = r15
            r209 = 0
            r210 = r2
            r2 = r206
            r206 = r5
            r5 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r5, r3)
            r5 = 0
            long r172 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r5)
            int r5 = java.lang.Long.hashCode(r172)
            r211 = r5
            androidx.compose.runtime.CompositionLocalMap r5 = r2.getCurrentCompositionLocalMap()
            r212 = r9
            r9 = r207
            r207 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r172 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r172 = r172.getConstructor()
            r213 = r2
            int r2 = r70 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r214 = r213
            r215 = r172
            r216 = 0
            r217 = r9
            r9 = r214
            r214 = r14
            r14 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r14, r12)
            androidx.compose.runtime.Applier r14 = r9.getApplier()
            boolean r14 = r14 instanceof androidx.compose.runtime.Applier
            if (r14 != 0) goto L307d
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L307d:
            r9.startReusableNode()
            boolean r14 = r9.getInserting()
            if (r14 == 0) goto L308c
            r14 = r215
            r9.createNode(r14)
            goto L3091
        L308c:
            r14 = r215
            r9.useNode()
        L3091:
            r215 = r9
            androidx.compose.runtime.Composer r9 = androidx.compose.runtime.Updater.m4364constructorimpl(r215)
            r172 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r173 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r218 = r14
            kotlin.jvm.functions.Function2 r14 = r173.getSetMeasurePolicy()
            r219 = r15
            r15 = r208
            androidx.compose.runtime.Updater.m4372setimpl(r9, r15, r14)
            androidx.compose.ui.node.ComposeUiNode$Companion r14 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r14 = r14.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r5, r14)
            java.lang.Integer r14 = java.lang.Integer.valueOf(r211)
            androidx.compose.ui.node.ComposeUiNode$Companion r173 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r208 = r5
            kotlin.jvm.functions.Function2 r5 = r173.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r9, r14, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r5 = r5.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r9, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r5 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r5 = r5.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r10, r5)
            int r5 = r2 >> 6
            r5 = r5 & 14
            r9 = r215
            r14 = 0
            r220 = r2
            r2 = 1833054614(0x6d423196, float:3.7562524E27)
            r221 = r5
            java.lang.String r5 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r5)
            androidx.compose.foundation.layout.BoxScopeInstance r2 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r5 = r11 >> 6
            r5 = r5 & 112(0x70, float:1.57E-43)
            r63 = 6
            r5 = r5 | 6
            androidx.compose.foundation.layout.BoxScope r2 = (androidx.compose.foundation.layout.BoxScope) r2
            r193 = r9
            r222 = 0
            r223 = r2
            r2 = -666418712(0xffffffffd84741e8, float:-8.7634352E14)
            r224 = r5
            java.lang.String r5 = "C735@45773L463:BillingScreen.kt#7ez3px"
            r225 = r9
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r2, r5)
            if (r4 == 0) goto L310f
            androidx.compose.ui.graphics.Color$Companion r2 = androidx.compose.ui.graphics.Color.INSTANCE
            long r172 = r2.m5131getWhite0d7_KjU()
            goto L3113
        L310f:
            long r172 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
        L3113:
            r173 = r172
            r2 = 10
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r2.getBold()
            androidx.compose.ui.text.style.TextAlign$Companion r2 = androidx.compose.ui.text.style.TextAlign.INSTANCE
            int r2 = r2.m7755getCentere0LSkKk()
            androidx.compose.ui.text.style.TextAlign r184 = androidx.compose.ui.text.style.TextAlign.m7748boximpl(r2)
            r172 = 0
            r175 = 0
            r178 = 0
            r180 = 0
            r181 = 0
            r183 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r194 = 1597440(0x186000, float:2.23849E-39)
            r195 = 0
            r196 = 261034(0x3fbaa, float:3.65787E-40)
            r193 = r9
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r193)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r225)
            r215.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r215)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r213)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r207)
            r70 = r7
            r2 = r53
            r4 = r198
            r7 = r199
            r9 = r200
            r10 = r201
            r11 = r202
            r14 = r203
            r15 = r204
            r5 = r205
            goto L2f1c
        L3180:
            r53 = r2
            r198 = r4
            r205 = r5
            r199 = r7
            r200 = r9
            r201 = r10
            r202 = r11
            r203 = r14
            r204 = r15
            r7 = r70
            r205.endReplaceGroup()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r205)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r200)
            r41.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r41)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r40)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r38)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 16
            r5 = 0
            float r9 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r9)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r2 = 11
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r2.getBold()
            r195 = 0
            r196 = 262058(0x3ffaa, float:3.67221E-40)
            java.lang.String r171 = "Discounts & Charges"
            r172 = 0
            r175 = 0
            r178 = 0
            r180 = 0
            r181 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r194 = 1597446(0x186006, float:2.238499E-39)
            r193 = r0
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r4 = 8
            r5 = 0
            float r9 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r9)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r4)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r4)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r9 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r2, r14, r10, r9)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r5 = 8
            r9 = 0
            float r10 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r4 = r4.m686spacedBy0680j_4(r5)
            androidx.compose.foundation.layout.Arrangement$Horizontal r4 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r4
            r5 = r0
            r74 = 54
            r9 = r74
            r10 = 0
            r11 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r11, r13)
            androidx.compose.ui.Alignment$Companion r11 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r11 = r11.getTop()
            int r14 = r9 >> 3
            r14 = r14 & 14
            int r15 = r9 >> 3
            r15 = r15 & 112(0x70, float:1.57E-43)
            r14 = r14 | r15
            androidx.compose.ui.layout.MeasurePolicy r14 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r4, r11, r5, r14)
            int r15 = r9 << 3
            r15 = r15 & 112(0x70, float:1.57E-43)
            r16 = r2
            r32 = r14
            r33 = r5
            r34 = 0
            r35 = r2
            r2 = r33
            r33 = r4
            r4 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r4, r3)
            r4 = 0
            long r36 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r2, r4)
            int r4 = java.lang.Long.hashCode(r36)
            r36 = r4
            androidx.compose.runtime.CompositionLocalMap r4 = r2.getCurrentCompositionLocalMap()
            r37 = r5
            r5 = r16
            r16 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r2, r5)
            androidx.compose.ui.node.ComposeUiNode$Companion r38 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r38 = r38.getConstructor()
            r39 = r2
            int r2 = r15 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r40 = r38
            r38 = r39
            r41 = 0
            r42 = r5
            r5 = r38
            r38 = r11
            r11 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r11, r12)
            androidx.compose.runtime.Applier r11 = r5.getApplier()
            boolean r11 = r11 instanceof androidx.compose.runtime.Applier
            if (r11 != 0) goto L32ac
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L32ac:
            r5.startReusableNode()
            boolean r11 = r5.getInserting()
            if (r11 == 0) goto L32bb
            r11 = r40
            r5.createNode(r11)
            goto L32c0
        L32bb:
            r11 = r40
            r5.useNode()
        L32c0:
            r40 = r5
            androidx.compose.runtime.Composer r5 = androidx.compose.runtime.Updater.m4364constructorimpl(r40)
            r43 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r44 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r45 = r11
            kotlin.jvm.functions.Function2 r11 = r44.getSetMeasurePolicy()
            r44 = r14
            r14 = r32
            androidx.compose.runtime.Updater.m4372setimpl(r5, r14, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r11 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r11 = r11.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r5, r4, r11)
            java.lang.Integer r11 = java.lang.Integer.valueOf(r36)
            androidx.compose.ui.node.ComposeUiNode$Companion r32 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r46 = r4
            kotlin.jvm.functions.Function2 r4 = r32.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r5, r11, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r5, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r5, r10, r4)
            int r4 = r2 >> 6
            r4 = r4 & 14
            r5 = r40
            r11 = 0
            r32 = r2
            r2 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r2, r8)
            androidx.compose.foundation.layout.RowScopeInstance r2 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r43 = r9 >> 6
            r43 = r43 & 112(0x70, float:1.57E-43)
            r63 = 6
            r43 = r43 | 6
            androidx.compose.foundation.layout.RowScope r2 = (androidx.compose.foundation.layout.RowScope) r2
            r256 = r5
            r47 = r2
            r2 = 0
            r53 = r2
            r2 = 978653279(0x3a55105f, float:8.1277447E-4)
            r70 = r4
            java.lang.String r4 = "C761@47566L548,757@47165L22,755@47019L1292,779@48913L548,775@48504L27,773@48353L1305:BillingScreen.kt#7ez3px"
            r264 = r5
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r2, r4)
            java.lang.String r2 = BillingScreen$lambda$30(r62)
            androidx.compose.foundation.text.KeyboardOptions r185 = new androidx.compose.foundation.text.KeyboardOptions
            androidx.compose.ui.text.input.KeyboardType$Companion r4 = androidx.compose.ui.text.input.KeyboardType.INSTANCE
            int r173 = r4.m7561getDecimalPjHm6EE()
            r178 = 123(0x7b, float:1.72E-43)
            r179 = 0
            r171 = 0
            r172 = 0
            r174 = 0
            r175 = 0
            r176 = 0
            r177 = 0
            r170 = r185
            r170.<init>(r171, r172, r173, r174, r175, r176, r177, r178, r179)
            r4 = r170
            androidx.compose.material3.OutlinedTextFieldDefaults r170 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r192 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r194 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r48 = androidx.compose.ui.graphics.Color.INSTANCE
            long r171 = r48.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r48 = androidx.compose.ui.graphics.Color.INSTANCE
            long r173 = r48.m5131getWhite0d7_KjU()
            long r179 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r181 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r175 = 0
            r177 = 0
            r183 = 0
            r185 = 0
            r187 = 0
            r189 = 0
            r191 = 0
            r196 = 0
            r198 = 0
            r200 = 0
            r202 = 0
            r204 = 0
            r206 = 0
            r208 = 0
            r210 = 0
            r212 = 0
            r214 = 0
            r216 = 0
            r218 = 0
            r220 = 0
            r222 = 0
            r224 = 0
            r226 = 0
            r228 = 0
            r230 = 0
            r232 = 0
            r234 = 0
            r236 = 0
            r238 = 0
            r240 = 0
            r242 = 0
            r244 = 0
            r246 = 0
            r248 = 0
            r250 = 0
            r252 = 0
            r254 = 0
            r48 = 54
            r49 = 0
            r50 = 0
            r51 = 0
            r52 = 3072(0xc00, float:4.305E-42)
            r17 = 2147477452(0x7fffe7cc, float:NaN)
            r262 = r17
            r17 = 4095(0xfff, float:5.738E-42)
            r263 = r17
            r257 = r48
            r258 = r49
            r259 = r50
            r260 = r51
            r261 = r52
            androidx.compose.material3.TextFieldColors r192 = r170.m2705colors0hiis_0(r171, r173, r175, r177, r179, r181, r183, r185, r187, r189, r191, r192, r194, r196, r198, r200, r202, r204, r206, r208, r210, r212, r214, r216, r218, r220, r222, r224, r226, r228, r230, r232, r234, r236, r238, r240, r242, r244, r246, r248, r250, r252, r254, r256, r257, r258, r259, r260, r261, r262, r263)
            r170 = r2
            r2 = 10
            r17 = 0
            r185 = r4
            float r4 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.foundation.shape.RoundedCornerShape r2 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r2)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            r48 = r4
            androidx.compose.ui.Modifier r48 = (androidx.compose.ui.Modifier) r48
            r51 = 2
            r52 = 0
            r49 = 1065353216(0x3f800000, float:1.0)
            androidx.compose.ui.Modifier r172 = androidx.compose.foundation.layout.RowScope.weight$default(r47, r48, r49, r50, r51, r52)
            r4 = -522617813(0xffffffffe0d97c2b, float:-1.25371585E20)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r5, r4, r6)
            r4 = r62
            boolean r17 = r5.changed(r4)
            r48 = r5
            r49 = 0
            java.lang.Object r5 = r48.rememberedValue()
            r50 = 0
            if (r17 != 0) goto L3436
            androidx.compose.runtime.Composer$Companion r51 = androidx.compose.runtime.Composer.INSTANCE
            r62 = r9
            java.lang.Object r9 = r51.getEmpty()
            if (r5 != r9) goto L3433
            goto L3438
        L3433:
            r9 = r48
            goto L3447
        L3436:
            r62 = r9
        L3438:
            r9 = 0
            r51 = r5
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda42 r5 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda42
            r5.<init>()
            r9 = r48
            r9.updateRememberedValue(r5)
        L3447:
            r171 = r5
            kotlin.jvm.functions.Function1 r171 = (kotlin.jvm.functions.Function1) r171
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r256)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r5 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r176 = r5.getLambda$2055015291$app()
            r191 = r2
            androidx.compose.ui.graphics.Shape r191 = (androidx.compose.ui.graphics.Shape) r191
            r173 = 0
            r174 = 0
            r175 = 0
            r177 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r186 = 0
            r187 = 1
            r188 = 0
            r189 = 0
            r190 = 0
            r194 = 1572864(0x180000, float:2.204052E-39)
            r195 = 12779520(0xc30000, float:1.7907922E-38)
            r196 = 0
            r197 = 1933240(0x1d7fb8, float:2.709046E-39)
            r193 = r256
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r170, r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197)
            java.lang.String r2 = BillingScreen$lambda$33(r71)
            androidx.compose.foundation.text.KeyboardOptions r185 = new androidx.compose.foundation.text.KeyboardOptions
            androidx.compose.ui.text.input.KeyboardType$Companion r5 = androidx.compose.ui.text.input.KeyboardType.INSTANCE
            int r173 = r5.m7561getDecimalPjHm6EE()
            r178 = 123(0x7b, float:1.72E-43)
            r171 = 0
            r172 = 0
            r176 = 0
            r170 = r185
            r170.<init>(r171, r172, r173, r174, r175, r176, r177, r178, r179)
            r5 = r170
            androidx.compose.material3.OutlinedTextFieldDefaults r170 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r192 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r194 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r9 = androidx.compose.ui.graphics.Color.INSTANCE
            long r171 = r9.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r9 = androidx.compose.ui.graphics.Color.INSTANCE
            long r173 = r9.m5131getWhite0d7_KjU()
            long r179 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r181 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r175 = 0
            r177 = 0
            r183 = 0
            r185 = 0
            r187 = 0
            r189 = 0
            r191 = 0
            r196 = 0
            r198 = 0
            r200 = 0
            r202 = 0
            r204 = 0
            r206 = 0
            r208 = 0
            r210 = 0
            r212 = 0
            r214 = 0
            r216 = 0
            r218 = 0
            r220 = 0
            r222 = 0
            r224 = 0
            r226 = 0
            r228 = 0
            r230 = 0
            r232 = 0
            r234 = 0
            r236 = 0
            r238 = 0
            r240 = 0
            r242 = 0
            r244 = 0
            r246 = 0
            r248 = 0
            r250 = 0
            r252 = 0
            r254 = 0
            r9 = 54
            r17 = 0
            r48 = 0
            r49 = 0
            r50 = 3072(0xc00, float:4.305E-42)
            r51 = 2147477452(0x7fffe7cc, float:NaN)
            r52 = 4095(0xfff, float:5.738E-42)
            r257 = r9
            r258 = r17
            r259 = r48
            r260 = r49
            r261 = r50
            r262 = r51
            r263 = r52
            androidx.compose.material3.TextFieldColors r192 = r170.m2705colors0hiis_0(r171, r173, r175, r177, r179, r181, r183, r185, r187, r189, r191, r192, r194, r196, r198, r200, r202, r204, r206, r208, r210, r212, r214, r216, r218, r220, r222, r224, r226, r228, r230, r232, r234, r236, r238, r240, r242, r244, r246, r248, r250, r252, r254, r256, r257, r258, r259, r260, r261, r262, r263)
            r9 = r256
            r170 = r2
            r2 = 10
            r17 = 0
            r274 = r4
            float r4 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.foundation.shape.RoundedCornerShape r2 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r2)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            r48 = r4
            androidx.compose.ui.Modifier r48 = (androidx.compose.ui.Modifier) r48
            r51 = 2
            r52 = 0
            r49 = 1065353216(0x3f800000, float:1.0)
            r50 = 0
            androidx.compose.ui.Modifier r172 = androidx.compose.foundation.layout.RowScope.weight$default(r47, r48, r49, r50, r51, r52)
            r4 = -522574960(0xffffffffe0da2390, float:-1.2574852E20)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r4, r6)
            r4 = r71
            boolean r17 = r9.changed(r4)
            r48 = r9
            r49 = 0
            r185 = r5
            java.lang.Object r5 = r48.rememberedValue()
            r50 = 0
            if (r17 != 0) goto L358c
            androidx.compose.runtime.Composer$Companion r51 = androidx.compose.runtime.Composer.INSTANCE
            r256 = r9
            java.lang.Object r9 = r51.getEmpty()
            if (r5 != r9) goto L3589
            goto L358f
        L3589:
            r9 = r48
            goto L359e
        L358c:
            r256 = r9
        L358f:
            r9 = 0
            r51 = r5
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda43 r5 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda43
            r5.<init>()
            r9 = r48
            r9.updateRememberedValue(r5)
        L359e:
            r171 = r5
            kotlin.jvm.functions.Function1 r171 = (kotlin.jvm.functions.Function1) r171
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r256)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r5 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r176 = r5.getLambda$324062948$app()
            r191 = r2
            androidx.compose.ui.graphics.Shape r191 = (androidx.compose.ui.graphics.Shape) r191
            r173 = 0
            r174 = 0
            r175 = 0
            r177 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r186 = 0
            r187 = 1
            r188 = 0
            r189 = 0
            r190 = 0
            r194 = 1572864(0x180000, float:2.204052E-39)
            r195 = 12779520(0xc30000, float:1.7907922E-38)
            r196 = 0
            r197 = 1933240(0x1d7fb8, float:2.709046E-39)
            r193 = r256
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r170, r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r256)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r264)
            r40.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r40)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r39)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r37)
            java.lang.String r2 = BillingScreen$lambda$24(r272)
            java.lang.String r5 = "DELIVERY"
            boolean r2 = kotlin.jvm.internal.Intrinsics.areEqual(r2, r5)
            if (r2 == 0) goto L3772
            r2 = 1322875404(0x4ed97a0c, float:1.82432717E9)
            r0.startReplaceGroup(r2)
            java.lang.String r2 = "793@49805L40,800@50452L548,796@50038L28,794@49886L1315"
            androidx.compose.runtime.ComposerKt.sourceInformation(r0, r2)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r5 = 8
            r9 = 0
            float r10 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r5)
            r10 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r10)
            java.lang.String r2 = BillingScreen$lambda$36(r72)
            androidx.compose.foundation.text.KeyboardOptions r32 = new androidx.compose.foundation.text.KeyboardOptions
            androidx.compose.ui.text.input.KeyboardType$Companion r5 = androidx.compose.ui.text.input.KeyboardType.INSTANCE
            int r35 = r5.m7561getDecimalPjHm6EE()
            r40 = 123(0x7b, float:1.72E-43)
            r41 = 0
            r33 = 0
            r34 = 0
            r36 = 0
            r37 = 0
            r38 = 0
            r39 = 0
            r32.<init>(r33, r34, r35, r36, r37, r38, r39, r40, r41)
            androidx.compose.material3.OutlinedTextFieldDefaults r171 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r193 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r195 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r172 = r5.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r174 = r5.m5131getWhite0d7_KjU()
            long r180 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r182 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r176 = 0
            r178 = 0
            r184 = 0
            r186 = 0
            r188 = 0
            r190 = 0
            r192 = 0
            r197 = 0
            r199 = 0
            r201 = 0
            r203 = 0
            r205 = 0
            r207 = 0
            r209 = 0
            r211 = 0
            r213 = 0
            r215 = 0
            r217 = 0
            r219 = 0
            r221 = 0
            r223 = 0
            r225 = 0
            r227 = 0
            r229 = 0
            r231 = 0
            r233 = 0
            r235 = 0
            r237 = 0
            r239 = 0
            r241 = 0
            r243 = 0
            r245 = 0
            r247 = 0
            r249 = 0
            r251 = 0
            r253 = 0
            r9 = 0
            r5 = 54
            r11 = 0
            r14 = 0
            r15 = 0
            r16 = 3072(0xc00, float:4.305E-42)
            r17 = 2147477452(0x7fffe7cc, float:NaN)
            r33 = 4095(0xfff, float:5.738E-42)
            r257 = r0
            r258 = r5
            r255 = r9
            r259 = r11
            r260 = r14
            r261 = r15
            r262 = r16
            r263 = r17
            r264 = r33
            androidx.compose.material3.TextFieldColors r193 = r171.m2705colors0hiis_0(r172, r174, r176, r178, r180, r182, r184, r186, r188, r190, r192, r193, r195, r197, r199, r201, r203, r205, r207, r209, r211, r213, r215, r217, r219, r221, r223, r225, r227, r229, r231, r233, r235, r237, r239, r241, r243, r245, r247, r249, r251, r253, r255, r257, r258, r259, r260, r261, r262, r263, r264)
            r5 = 10
            r9 = 0
            float r10 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.foundation.shape.RoundedCornerShape r5 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r5)
            androidx.compose.ui.Modifier$Companion r9 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r9 = (androidx.compose.ui.Modifier) r9
            r10 = 0
            r14 = 0
            r15 = 1
            androidx.compose.ui.Modifier r173 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r9, r14, r15, r10)
            r9 = 2120890734(0x7e6a396e, float:7.7834386E37)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r9, r6)
            r9 = r72
            boolean r10 = r0.changed(r9)
            r11 = r0
            r14 = 0
            java.lang.Object r15 = r11.rememberedValue()
            r16 = 0
            if (r10 != 0) goto L3715
            androidx.compose.runtime.Composer$Companion r17 = androidx.compose.runtime.Composer.INSTANCE
            r42 = r0
            java.lang.Object r0 = r17.getEmpty()
            if (r15 != r0) goto L3714
            goto L3717
        L3714:
            goto L3724
        L3715:
            r42 = r0
        L3717:
            r0 = 0
            r17 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda44 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda44
            r0.<init>()
            r11.updateRememberedValue(r0)
            r15 = r0
        L3724:
            r172 = r15
            kotlin.jvm.functions.Function1 r172 = (kotlin.jvm.functions.Function1) r172
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r42)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r0 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r177 = r0.m8430getLambda$2125658115$app()
            r192 = r5
            androidx.compose.ui.graphics.Shape r192 = (androidx.compose.ui.graphics.Shape) r192
            r174 = 0
            r175 = 0
            r176 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 1
            r189 = 0
            r190 = 0
            r191 = 0
            r195 = 1573248(0x180180, float:2.20459E-39)
            r196 = 12779520(0xc30000, float:1.7907922E-38)
            r197 = 0
            r198 = 1933240(0x1d7fb8, float:2.709046E-39)
            r171 = r2
            r186 = r32
            r194 = r42
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            r0 = r194
            r0.endReplaceGroup()
            goto L377d
        L3772:
            r9 = r72
            r2 = 1324293840(0x4eef1ed0, float:2.00588698E9)
            r0.startReplaceGroup(r2)
            r0.endReplaceGroup()
        L377d:
            java.lang.String r2 = BillingScreen$lambda$24(r272)
            java.lang.String r5 = "PRE-ORDER"
            boolean r2 = kotlin.jvm.internal.Intrinsics.areEqual(r2, r5)
            if (r2 != 0) goto L37a5
            java.lang.String r2 = BillingScreen$lambda$9(r54)
            java.lang.String r5 = "PREORDER"
            boolean r2 = kotlin.jvm.internal.Intrinsics.areEqual(r2, r5)
            if (r2 == 0) goto L3796
            goto L37a5
        L3796:
            r2 = 1327416656(0x4f1ec550, float:2.6637312E9)
            r0.startReplaceGroup(r2)
            r0.endReplaceGroup()
            r11 = r73
            r10 = r120
            goto L3aa7
        L37a5:
            r2 = 1324538461(0x4ef2da5d, float:2.03719846E9)
            r0.startReplaceGroup(r2)
            java.lang.String r2 = "815@51434L41,816@51516L96,817@51653L40,824@52170L548,821@51883L24,819@51735L1184,836@52961L40,844@53600L548,840@53192L25,838@53043L1306"
            androidx.compose.runtime.ComposerKt.sourceInformation(r0, r2)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r5 = 16
            r10 = 0
            float r11 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r5)
            r10 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r10)
            long r173 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r2 = 11
            long r176 = androidx.compose.ui.unit.TextUnitKt.getSp(r2)
            androidx.compose.ui.text.font.FontWeight$Companion r2 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r179 = r2.getBold()
            r195 = 0
            r196 = 262058(0x3ffaa, float:3.67221E-40)
            r172 = 0
            r175 = 0
            r178 = 0
            r180 = 0
            r181 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r190 = 0
            r191 = 0
            r192 = 0
            r194 = 1597446(0x186006, float:2.238499E-39)
            java.lang.String r171 = "Pre-Order Details"
            r193 = r0
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r171, r172, r173, r175, r176, r178, r179, r180, r181, r183, r184, r185, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r5 = 8
            r10 = 0
            float r11 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r5)
            r10 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r10)
            java.lang.String r2 = BillingScreen$lambda$39(r120)
            androidx.compose.material3.OutlinedTextFieldDefaults r171 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r193 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r195 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r172 = r5.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r174 = r5.m5131getWhite0d7_KjU()
            long r180 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r182 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r176 = 0
            r178 = 0
            r184 = 0
            r186 = 0
            r188 = 0
            r190 = 0
            r197 = 0
            r199 = 0
            r201 = 0
            r203 = 0
            r205 = 0
            r207 = 0
            r209 = 0
            r211 = 0
            r213 = 0
            r215 = 0
            r217 = 0
            r219 = 0
            r221 = 0
            r223 = 0
            r225 = 0
            r227 = 0
            r229 = 0
            r231 = 0
            r233 = 0
            r235 = 0
            r237 = 0
            r239 = 0
            r241 = 0
            r243 = 0
            r245 = 0
            r247 = 0
            r249 = 0
            r251 = 0
            r253 = 0
            r10 = 0
            r5 = 54
            r14 = 0
            r15 = 0
            r16 = 0
            r17 = 3072(0xc00, float:4.305E-42)
            r32 = 2147477452(0x7fffe7cc, float:NaN)
            r33 = 4095(0xfff, float:5.738E-42)
            r257 = r0
            r258 = r5
            r255 = r10
            r259 = r14
            r260 = r15
            r261 = r16
            r262 = r17
            r263 = r32
            r264 = r33
            androidx.compose.material3.TextFieldColors r193 = r171.m2705colors0hiis_0(r172, r174, r176, r178, r180, r182, r184, r186, r188, r190, r192, r193, r195, r197, r199, r201, r203, r205, r207, r209, r211, r213, r215, r217, r219, r221, r223, r225, r227, r229, r231, r233, r235, r237, r239, r241, r243, r245, r247, r249, r251, r253, r255, r257, r258, r259, r260, r261, r262, r263, r264)
            r5 = 10
            r10 = 0
            float r11 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.foundation.shape.RoundedCornerShape r5 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r5)
            androidx.compose.ui.Modifier$Companion r10 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r10 = (androidx.compose.ui.Modifier) r10
            r11 = 0
            r14 = 0
            r15 = 1
            androidx.compose.ui.Modifier r173 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r10, r14, r15, r11)
            r10 = 2120949770(0x7e6b200a, float:7.8133734E37)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r10, r6)
            r10 = r120
            boolean r11 = r0.changed(r10)
            r14 = r0
            r15 = 0
            r42 = r0
            java.lang.Object r0 = r14.rememberedValue()
            r16 = 0
            if (r11 != 0) goto L38eb
            androidx.compose.runtime.Composer$Companion r17 = androidx.compose.runtime.Composer.INSTANCE
            r171 = r2
            java.lang.Object r2 = r17.getEmpty()
            if (r0 != r2) goto L38ea
            goto L38ed
        L38ea:
            goto L38fa
        L38eb:
            r171 = r2
        L38ed:
            r2 = 0
            r17 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda45 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda45
            r0.<init>()
            r14.updateRememberedValue(r0)
        L38fa:
            r172 = r0
            kotlin.jvm.functions.Function1 r172 = (kotlin.jvm.functions.Function1) r172
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r42)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r0 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r177 = r0.getLambda$1835402278$app()
            r192 = r5
            androidx.compose.ui.graphics.Shape r192 = (androidx.compose.ui.graphics.Shape) r192
            r174 = 0
            r175 = 0
            r176 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r186 = 0
            r187 = 0
            r188 = 1
            r189 = 0
            r190 = 0
            r191 = 0
            r195 = 1573248(0x180180, float:2.20459E-39)
            r196 = 12582912(0xc00000, float:1.7632415E-38)
            r197 = 0
            r198 = 1966008(0x1dffb8, float:2.754964E-39)
            r194 = r42
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            r0 = r194
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r5 = 8
            r11 = 0
            float r14 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r5)
            r5 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r5)
            java.lang.String r2 = BillingScreen$lambda$42(r73)
            androidx.compose.foundation.text.KeyboardOptions r32 = new androidx.compose.foundation.text.KeyboardOptions
            androidx.compose.ui.text.input.KeyboardType$Companion r5 = androidx.compose.ui.text.input.KeyboardType.INSTANCE
            int r35 = r5.m7561getDecimalPjHm6EE()
            r40 = 123(0x7b, float:1.72E-43)
            r41 = 0
            r33 = 0
            r34 = 0
            r36 = 0
            r37 = 0
            r38 = 0
            r39 = 0
            r32.<init>(r33, r34, r35, r36, r37, r38, r39, r40, r41)
            androidx.compose.material3.OutlinedTextFieldDefaults r171 = androidx.compose.material3.OutlinedTextFieldDefaults.INSTANCE
            long r193 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            long r195 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r172 = r5.m5131getWhite0d7_KjU()
            androidx.compose.ui.graphics.Color$Companion r5 = androidx.compose.ui.graphics.Color.INSTANCE
            long r174 = r5.m5131getWhite0d7_KjU()
            long r180 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            long r182 = com.example.sasloopmanager.theme.ColorKt.getInputDark()
            r176 = 0
            r178 = 0
            r184 = 0
            r186 = 0
            r188 = 0
            r190 = 0
            r192 = 0
            r197 = 0
            r199 = 0
            r201 = 0
            r203 = 0
            r205 = 0
            r207 = 0
            r209 = 0
            r211 = 0
            r213 = 0
            r215 = 0
            r217 = 0
            r219 = 0
            r221 = 0
            r223 = 0
            r225 = 0
            r227 = 0
            r229 = 0
            r231 = 0
            r233 = 0
            r235 = 0
            r237 = 0
            r239 = 0
            r241 = 0
            r243 = 0
            r245 = 0
            r247 = 0
            r249 = 0
            r251 = 0
            r253 = 0
            r14 = 0
            r5 = 54
            r11 = 0
            r16 = 0
            r17 = 0
            r33 = 3072(0xc00, float:4.305E-42)
            r34 = 2147477452(0x7fffe7cc, float:NaN)
            r35 = 4095(0xfff, float:5.738E-42)
            r257 = r0
            r258 = r5
            r259 = r11
            r255 = r14
            r260 = r16
            r261 = r17
            r262 = r33
            r263 = r34
            r264 = r35
            androidx.compose.material3.TextFieldColors r193 = r171.m2705colors0hiis_0(r172, r174, r176, r178, r180, r182, r184, r186, r188, r190, r192, r193, r195, r197, r199, r201, r203, r205, r207, r209, r211, r213, r215, r217, r219, r221, r223, r225, r227, r229, r231, r233, r235, r237, r239, r241, r243, r245, r247, r249, r251, r253, r255, r257, r258, r259, r260, r261, r262, r263, r264)
            r5 = 10
            r11 = 0
            float r14 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            androidx.compose.foundation.shape.RoundedCornerShape r5 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r5)
            androidx.compose.ui.Modifier$Companion r11 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r11 = (androidx.compose.ui.Modifier) r11
            r171 = r2
            r2 = 1
            r14 = 0
            r15 = 0
            androidx.compose.ui.Modifier r173 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r11, r14, r2, r15)
            r2 = 2120991659(0x7e6bc3ab, float:7.8346136E37)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r2, r6)
            r11 = r73
            boolean r2 = r0.changed(r11)
            r14 = r0
            r15 = 0
            r42 = r0
            java.lang.Object r0 = r14.rememberedValue()
            r16 = 0
            if (r2 != 0) goto L3a4d
            androidx.compose.runtime.Composer$Companion r17 = androidx.compose.runtime.Composer.INSTANCE
            r33 = r2
            java.lang.Object r2 = r17.getEmpty()
            if (r0 != r2) goto L3a4c
            goto L3a4f
        L3a4c:
            goto L3a5c
        L3a4d:
            r33 = r2
        L3a4f:
            r2 = 0
            r17 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda46 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda46
            r0.<init>()
            r14.updateRememberedValue(r0)
        L3a5c:
            r172 = r0
            kotlin.jvm.functions.Function1 r172 = (kotlin.jvm.functions.Function1) r172
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r42)
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r0 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function2 r177 = r0.m8431getLambda$723531761$app()
            r192 = r5
            androidx.compose.ui.graphics.Shape r192 = (androidx.compose.ui.graphics.Shape) r192
            r174 = 0
            r175 = 0
            r176 = 0
            r178 = 0
            r179 = 0
            r180 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r185 = 0
            r187 = 0
            r188 = 1
            r189 = 0
            r190 = 0
            r191 = 0
            r195 = 1573248(0x180180, float:2.20459E-39)
            r196 = 12779520(0xc30000, float:1.7907922E-38)
            r197 = 0
            r198 = 1933240(0x1d7fb8, float:2.709046E-39)
            r186 = r32
            r194 = r42
            androidx.compose.material3.OutlinedTextFieldKt.OutlinedTextField(r171, r172, r173, r174, r175, r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188, r189, r190, r191, r192, r193, r194, r195, r196, r197, r198)
            r0 = r194
            r0.endReplaceGroup()
        L3aa7:
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r5 = 20
            r14 = 0
            float r15 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r15)
            androidx.compose.ui.Modifier r2 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r2, r5)
            r5 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r2, r0, r5)
            java.util.Map r2 = BillingScreen$lambda$4(r268)
            java.util.Set r2 = r2.entrySet()
            java.lang.Iterable r2 = (java.lang.Iterable) r2
            java.util.Iterator r2 = r2.iterator()
            r14 = 0
            r33 = r14
        L3acd:
            boolean r5 = r2.hasNext()
            if (r5 == 0) goto L3af8
            java.lang.Object r5 = r2.next()
            java.util.Map$Entry r5 = (java.util.Map.Entry) r5
            r14 = 0
            java.lang.Object r15 = r5.getKey()
            com.example.sasloopmanager.data.MenuItem r15 = (com.example.sasloopmanager.data.MenuItem) r15
            java.lang.Object r5 = r5.getValue()
            java.lang.Number r5 = (java.lang.Number) r5
            int r5 = r5.intValue()
            double r16 = r15.getPrice()
            r32 = r14
            r35 = r15
            double r14 = (double) r5
            double r16 = r16 * r14
            double r33 = r33 + r16
            goto L3acd
        L3af8:
            r14 = r33
            java.lang.String r2 = BillingScreen$lambda$30(r274)
            java.lang.Double r2 = kotlin.text.StringsKt.toDoubleOrNull(r2)
            if (r2 == 0) goto L3b09
            double r16 = r2.doubleValue()
            goto L3b0b
        L3b09:
            r16 = 0
        L3b0b:
            r35 = r16
            r16 = r35
            r71 = r4
            double r4 = r14 - r16
            r45 = r14
            r14 = 0
            double r4 = kotlin.ranges.RangesKt.coerceAtLeast(r4, r14)
            r14 = 4582862980812216730(0x3f9999999999999a, double:0.025)
            double r14 = r14 * r4
            r32 = 4582862980812216730(0x3f9999999999999a, double:0.025)
            double r47 = r4 * r32
            java.lang.String r2 = BillingScreen$lambda$33(r71)
            java.lang.Double r2 = kotlin.text.StringsKt.toDoubleOrNull(r2)
            if (r2 == 0) goto L3b37
            double r32 = r2.doubleValue()
            goto L3b39
        L3b37:
            r32 = 0
        L3b39:
            r43 = r32
            r49 = r43
            java.lang.String r2 = BillingScreen$lambda$24(r272)
            r193 = r0
            java.lang.String r0 = "DELIVERY"
            boolean r0 = kotlin.jvm.internal.Intrinsics.areEqual(r2, r0)
            if (r0 == 0) goto L3b5a
            java.lang.String r0 = BillingScreen$lambda$36(r9)
            java.lang.Double r0 = kotlin.text.StringsKt.toDoubleOrNull(r0)
            if (r0 == 0) goto L3b5a
            double r32 = r0.doubleValue()
            goto L3b5c
        L3b5a:
            r32 = 0
        L3b5c:
            r51 = r32
            double r32 = r4 + r14
            double r32 = r32 + r47
            double r32 = r32 + r49
            double r72 = r32 + r51
            java.lang.String r0 = BillingScreen$lambda$42(r11)
            java.lang.Double r0 = kotlin.text.StringsKt.toDoubleOrNull(r0)
            if (r0 == 0) goto L3b75
            double r32 = r0.doubleValue()
            goto L3b77
        L3b75:
            r32 = 0
        L3b77:
            r170 = r32
            r172 = r4
            double r4 = r72 - r170
            r174 = r14
            r14 = 0
            double r14 = kotlin.ranges.RangesKt.coerceAtLeast(r4, r14)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 0
            r4 = 0
            r5 = 1
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r0, r4, r5, r2)
            androidx.compose.material3.CardDefaults r33 = androidx.compose.material3.CardDefaults.INSTANCE
            long r34 = com.example.sasloopmanager.theme.ColorKt.getCardDark()
            int r2 = androidx.compose.material3.CardDefaults.$stable
            int r43 = r2 << 12
            r44 = 14
            r36 = 0
            r38 = 0
            r40 = 0
            r42 = r193
            androidx.compose.material3.CardColors r2 = r33.m2141cardColorsro_MJ88(r34, r36, r38, r40, r42, r43, r44)
            r4 = r42
            r5 = 1
            r32 = 0
            r62 = r0
            float r0 = (float) r5
            float r0 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r0)
            r32 = r14
            long r14 = com.example.sasloopmanager.theme.ColorKt.getCardBorderDark()
            androidx.compose.foundation.BorderStroke r0 = androidx.compose.foundation.BorderStrokeKt.m288BorderStrokecXLIe8U(r0, r14)
            r14 = r32
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda47 r32 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda47
            r35 = r16
            r33 = r45
            r41 = r47
            r43 = r49
            r45 = r51
            r47 = r72
            r49 = r170
            r37 = r172
            r39 = r174
            r53 = r272
            r51 = r14
            r32.<init>()
            r72 = r9
            r120 = r10
            r14 = r35
            r275 = r41
            r9 = r43
            r277 = r45
            r279 = r49
            r281 = r51
            r5 = r53
            r37 = r0
            r35 = r2
            r0 = r32
            r45 = r33
            r2 = -875550647(0xffffffffcbd02849, float:-2.7283602E7)
            r73 = r11
            r9 = 1
            r11 = 54
            androidx.compose.runtime.internal.ComposableLambda r0 = androidx.compose.runtime.internal.ComposableLambdaKt.rememberComposableLambda(r2, r9, r0, r4, r11)
            r38 = r0
            kotlin.jvm.functions.Function3 r38 = (kotlin.jvm.functions.Function3) r38
            r34 = 0
            r36 = 0
            r40 = 196614(0x30006, float:2.75515E-40)
            r41 = 10
            r39 = r4
            r33 = r62
            androidx.compose.material3.CardKt.Card(r33, r34, r35, r36, r37, r38, r39, r40, r41)
            r9 = r39
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 24
            r4 = 0
            float r10 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.m848height3ABfNKs(r0, r2)
            r4 = 6
            androidx.compose.foundation.layout.SpacerKt.Spacer(r0, r9, r4)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r2 = 1
            r4 = 0
            r10 = 0
            androidx.compose.ui.Modifier r32 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r0, r4, r2, r10)
            r0 = 24
            r2 = 0
            float r4 = (float) r0
            float r36 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            r37 = 7
            r38 = 0
            r33 = 0
            r34 = 0
            r35 = 0
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.PaddingKt.m820paddingqDBjuR0$default(r32, r33, r34, r35, r36, r37, r38)
            androidx.compose.foundation.layout.Arrangement r2 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r4 = 8
            r10 = 0
            float r11 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r11)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r2 = r2.m686spacedBy0680j_4(r4)
            androidx.compose.foundation.layout.Arrangement$Horizontal r2 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r2
            r10 = r2
            r11 = r9
            r27 = r0
            r74 = 54
            r32 = 0
            r0 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r11, r0, r13)
            androidx.compose.ui.Alignment$Companion r0 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r13 = r0.getTop()
            int r0 = r74 >> 3
            r0 = r0 & 14
            int r2 = r74 >> 3
            r2 = r2 & 112(0x70, float:1.57E-43)
            r0 = r0 | r2
            androidx.compose.ui.layout.MeasurePolicy r33 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r10, r13, r11, r0)
            int r0 = r74 << 3
            r0 = r0 & 112(0x70, float:1.57E-43)
            r34 = r0
            r0 = r33
            r2 = r27
            r4 = r11
            r35 = 0
            r193 = r9
            r9 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r9, r3)
            r3 = 0
            long r16 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r4, r3)
            int r36 = java.lang.Long.hashCode(r16)
            androidx.compose.runtime.CompositionLocalMap r9 = r4.getCurrentCompositionLocalMap()
            androidx.compose.ui.Modifier r3 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r4, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r16 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r16 = r16.getConstructor()
            r17 = r2
            int r2 = r34 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r37 = r2
            r2 = r16
            r38 = r4
            r39 = 0
            r18 = r4
            r16 = r10
            r10 = r38
            r4 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r10, r4, r12)
            androidx.compose.runtime.Applier r4 = r10.getApplier()
            boolean r4 = r4 instanceof androidx.compose.runtime.Applier
            if (r4 != 0) goto L3cd7
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L3cd7:
            r10.startReusableNode()
            boolean r4 = r10.getInserting()
            if (r4 == 0) goto L3ce4
            r10.createNode(r2)
            goto L3ce7
        L3ce4:
            r10.useNode()
        L3ce7:
            androidx.compose.runtime.Composer r4 = androidx.compose.runtime.Updater.m4364constructorimpl(r10)
            r12 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r38 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r40 = r2
            kotlin.jvm.functions.Function2 r2 = r38.getSetMeasurePolicy()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r0, r2)
            androidx.compose.ui.node.ComposeUiNode$Companion r2 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r2 = r2.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r9, r2)
            java.lang.Integer r2 = java.lang.Integer.valueOf(r36)
            androidx.compose.ui.node.ComposeUiNode$Companion r38 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r41 = r0
            kotlin.jvm.functions.Function2 r0 = r38.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r4, r2, r0)
            androidx.compose.ui.node.ComposeUiNode$Companion r0 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r0 = r0.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r4, r0)
            androidx.compose.ui.node.ComposeUiNode$Companion r0 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r0 = r0.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r3, r0)
            int r0 = r37 >> 6
            r38 = r0 & 14
            r12 = r10
            r42 = 0
            r2 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r12, r2, r8)
            androidx.compose.foundation.layout.RowScopeInstance r0 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r2 = r74 >> 6
            r2 = r2 & 112(0x70, float:1.57E-43)
            r63 = 6
            r49 = r2 | 6
            androidx.compose.foundation.layout.RowScope r0 = (androidx.compose.foundation.layout.RowScope) r0
            r2 = r12
            r176 = r0
            r50 = 0
            r0 = 520123222(0x1f007356, float:2.7200458E-20)
            java.lang.String r4 = "C945@60605L41,933@59787L672,932@59725L1434,974@62909L39,955@61353L1410,954@61291L2171:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r2, r0, r4)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            r177 = r0
            androidx.compose.ui.Modifier r177 = (androidx.compose.ui.Modifier) r177
            r180 = 2
            r181 = 0
            r178 = 1065353216(0x3f800000, float:1.0)
            r179 = 0
            androidx.compose.ui.Modifier r8 = androidx.compose.foundation.layout.RowScope.weight$default(r176, r177, r178, r179, r180, r181)
            r51 = r176
            androidx.compose.material3.ButtonDefaults r176 = androidx.compose.material3.ButtonDefaults.INSTANCE
            long r177 = com.example.sasloopmanager.theme.ColorKt.getStatusInfo()
            int r0 = androidx.compose.material3.ButtonDefaults.$stable
            int r186 = r0 << 12
            r187 = 14
            r179 = 0
            r181 = 0
            r183 = 0
            r185 = r2
            androidx.compose.material3.ButtonColors r180 = r176.m2121buttonColorsro_MJ88(r177, r179, r181, r183, r185, r186, r187)
            r0 = r185
            r2 = 10
            r4 = 0
            r52 = r3
            float r3 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r3)
            androidx.compose.foundation.shape.RoundedCornerShape r53 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r2)
            r2 = 709513748(0x2a4a5214, float:1.796968E-13)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r2, r6)
            r2 = r30
            boolean r3 = r2.changedInstance(r1)
            r4 = r273
            boolean r30 = r2.changed(r4)
            r3 = r3 | r30
            r0 = r271
            boolean r30 = r2.changed(r0)
            r3 = r3 | r30
            boolean r30 = r2.changed(r5)
            r3 = r3 | r30
            r0 = r144
            boolean r30 = r2.changed(r0)
            r3 = r3 | r30
            r30 = r185
            r58 = r3
            r59 = 0
            java.lang.Object r3 = r30.rememberedValue()
            r62 = 0
            if (r58 != 0) goto L3de9
            androidx.compose.runtime.Composer$Companion r63 = androidx.compose.runtime.Composer.INSTANCE
            r144 = r0
            java.lang.Object r0 = r63.getEmpty()
            if (r3 != r0) goto L3dc8
            goto L3deb
        L3dc8:
            r0 = r157
            r157 = r156
            r156 = r0
            r177 = r8
            r283 = r61
            r284 = r66
            r257 = r169
            r0 = r271
            r8 = r2
            r2 = r4
            r4 = r5
            r5 = r30
            r66 = r40
            r61 = r52
            r40 = r17
            r52 = r18
            goto L3e21
        L3de9:
            r144 = r0
        L3deb:
            r63 = 0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda48 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda48
            r177 = r157
            r157 = r156
            r156 = r177
            r177 = r8
            r283 = r61
            r284 = r66
            r257 = r169
            r8 = r2
            r2 = r4
            r4 = r5
            r66 = r40
            r61 = r52
            r5 = r144
            r40 = r17
            r52 = r18
            r17 = r3
            r3 = r271
            r0.<init>()
            r144 = r3
            r3 = r0
            r0 = r144
            r144 = r5
            r5 = r30
            r5.updateRememberedValue(r3)
        L3e21:
            r176 = r3
            kotlin.jvm.functions.Function0 r176 = (kotlin.jvm.functions.Function0) r176
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r185)
            r179 = r53
            androidx.compose.ui.graphics.Shape r179 = (androidx.compose.ui.graphics.Shape) r179
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r3 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function3 r3 = r3.getLambda$1348339844$app()
            r178 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r187 = 805306368(0x30000000, float:4.656613E-10)
            r188 = 484(0x1e4, float:6.78E-43)
            r186 = r185
            r185 = r3
            androidx.compose.material3.ButtonKt.Button(r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188)
            r185 = r186
            androidx.compose.ui.Modifier$Companion r3 = androidx.compose.ui.Modifier.INSTANCE
            r177 = r3
            androidx.compose.ui.Modifier r177 = (androidx.compose.ui.Modifier) r177
            r180 = 2
            r178 = 1065353216(0x3f800000, float:1.0)
            r179 = 0
            r176 = r51
            androidx.compose.ui.Modifier r30 = androidx.compose.foundation.layout.RowScope.weight$default(r176, r177, r178, r179, r180, r181)
            androidx.compose.material3.ButtonDefaults r176 = androidx.compose.material3.ButtonDefaults.INSTANCE
            long r177 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            int r3 = androidx.compose.material3.ButtonDefaults.$stable
            int r186 = r3 << 12
            r187 = 14
            r179 = 0
            r181 = 0
            r183 = 0
            androidx.compose.material3.ButtonColors r180 = r176.m2121buttonColorsro_MJ88(r177, r179, r181, r183, r185, r186, r187)
            r3 = r185
            r5 = 10
            r17 = 0
            r18 = r9
            float r9 = (float) r5
            float r5 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r9)
            androidx.compose.foundation.shape.RoundedCornerShape r53 = androidx.compose.foundation.shape.RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(r5)
            r5 = 709564598(0x2a4b18b6, float:1.8038595E-13)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r3, r5, r6)
            boolean r5 = r8.changedInstance(r1)
            boolean r6 = r8.changed(r2)
            r5 = r5 | r6
            boolean r6 = r8.changed(r0)
            r5 = r5 | r6
            boolean r6 = r8.changed(r7)
            r5 = r5 | r6
            boolean r6 = r8.changed(r4)
            r5 = r5 | r6
            boolean r6 = r8.changed(r14)
            r5 = r5 | r6
            r9 = r0
            r0 = r43
            boolean r6 = r8.changed(r0)
            r5 = r5 | r6
            r0 = r277
            boolean r6 = r8.changed(r0)
            r5 = r5 | r6
            r0 = r174
            boolean r6 = r8.changed(r0)
            r5 = r5 | r6
            r0 = r275
            boolean r6 = r8.changed(r0)
            r5 = r5 | r6
            r6 = r120
            boolean r17 = r8.changed(r6)
            r5 = r5 | r17
            r0 = r279
            boolean r17 = r8.changed(r0)
            r5 = r5 | r17
            r0 = r281
            boolean r17 = r8.changed(r0)
            r5 = r5 | r17
            r58 = r3
            r59 = r5
            r62 = 0
            java.lang.Object r5 = r58.rememberedValue()
            r63 = 0
            if (r59 != 0) goto L3f4a
            androidx.compose.runtime.Composer$Companion r17 = androidx.compose.runtime.Composer.INSTANCE
            r281 = r0
            java.lang.Object r0 = r17.getEmpty()
            if (r5 != r0) goto L3ef7
            goto L3f4d
        L3ef7:
            r1 = r286
            r185 = r3
            r70 = r7
            r285 = r8
            r271 = r9
            r77 = r11
            r169 = r12
            r118 = r13
            r123 = r18
            r0 = r58
            r120 = r107
            r170 = r115
            r8 = r174
            r107 = r101
            r115 = r102
            r174 = r114
            r101 = r90
            r102 = r95
            r95 = r97
            r114 = r108
            r97 = r80
            r90 = r81
            r108 = r106
            r81 = r19
            r80 = r20
            r106 = r99
            r19 = r4
            r20 = r6
            r99 = r88
            r4 = r2
            r2 = r43
            r88 = r82
            r43 = r287
            r44 = r16
            r82 = r79
            r79 = r73
            r73 = r72
            r72 = r69
            r69 = r164
            r164 = r10
            goto L3fbe
        L3f4a:
            r281 = r0
        L3f4d:
            r70 = 0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda50 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda50
            r1 = r286
            r185 = r3
            r171 = r5
            r285 = r8
            r17 = r9
            r77 = r11
            r169 = r12
            r118 = r13
            r123 = r18
            r120 = r107
            r170 = r115
            r8 = r174
            r12 = r279
            r18 = r7
            r107 = r101
            r115 = r102
            r174 = r114
            r101 = r90
            r102 = r95
            r95 = r97
            r114 = r108
            r97 = r80
            r90 = r81
            r108 = r106
            r81 = r19
            r80 = r20
            r106 = r99
            r19 = r4
            r20 = r6
            r4 = r43
            r99 = r88
            r6 = r277
            r43 = r287
            r44 = r16
            r88 = r82
            r16 = r2
            r2 = r14
            r82 = r79
            r14 = r281
            r79 = r73
            r73 = r72
            r72 = r69
            r69 = r164
            r164 = r10
            r10 = r275
            r0.<init>()
            r271 = r17
            r70 = r18
            r14 = r2
            r2 = r4
            r4 = r16
            r5 = r0
            r0 = r58
            r0.updateRememberedValue(r5)
        L3fbe:
            r176 = r5
            kotlin.jvm.functions.Function0 r176 = (kotlin.jvm.functions.Function0) r176
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r185)
            r179 = r53
            androidx.compose.ui.graphics.Shape r179 = (androidx.compose.ui.graphics.Shape) r179
            com.example.sasloopmanager.ComposableSingletons$BillingScreenKt r0 = com.example.sasloopmanager.ComposableSingletons$BillingScreenKt.INSTANCE
            kotlin.jvm.functions.Function3 r0 = r0.getLambda$2122602861$app()
            r178 = 0
            r181 = 0
            r182 = 0
            r183 = 0
            r184 = 0
            r187 = 805306368(0x30000000, float:4.656613E-10)
            r188 = 484(0x1e4, float:6.78E-43)
            r177 = r30
            r186 = r185
            r185 = r0
            androidx.compose.material3.ButtonKt.Button(r176, r177, r178, r179, r180, r181, r182, r183, r184, r185, r186, r187, r188)
            r185 = r186
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r185)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r169)
            r164.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r164)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r52)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r77)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r193)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r257)
            r156.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r156)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r157)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r155)
            r153.endReplaceGroup()
        L401b:
            r153.endReplaceGroup()
        L401e:
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r153)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r142)
            r131.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r131)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r145)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r125)
            r129.endReplaceGroup()
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
            r273 = r4
            r5 = r129
            r61 = r283
            r66 = r284
            goto L49ed
        L4045:
            r268 = r287
            r285 = r7
            r129 = r9
            r270 = r30
            r283 = r61
            r274 = r62
            r284 = r66
            r2 = r67
            r174 = r114
            r271 = r144
            r4 = r170
            r67 = r0
            r144 = r5
            r114 = r108
            r170 = r115
            r115 = r102
            r108 = r106
            r102 = r95
            r95 = r97
            r106 = r99
            r97 = r80
            r99 = r88
            r80 = r20
            r88 = r82
            r20 = r120
            r82 = r79
            r120 = r107
            r79 = r73
            r107 = r101
            r73 = r72
            r101 = r90
            r72 = r69
            r90 = r81
            r81 = r19
            r19 = r53
            r69 = r68
            r0 = -410813187(0xffffffffe7837cfd, float:-1.2418713E24)
            r9.startReplaceGroup(r0)
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r2)
            boolean r0 = BillingScreen$lambda$11(r55)
            if (r0 == 0) goto L41ec
            java.util.List r0 = BillingScreen$lambda$6(r31)
            boolean r0 = r0.isEmpty()
            if (r0 == 0) goto L41ec
            r0 = -410818488(0xffffffffe7836848, float:-1.2411073E24)
            r9.startReplaceGroup(r0)
            java.lang.String r0 = "264@13367L164"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r0)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r8 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r0, r14, r10, r8)
            androidx.compose.ui.Alignment$Companion r2 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment r2 = r2.getCenter()
            r5 = 54
            r6 = r9
            r7 = 0
            java.lang.String r8 = "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo"
            r15 = 1042775818(0x3e277f0a, float:0.16357055)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r6, r15, r8)
            r8 = 0
            androidx.compose.ui.layout.MeasurePolicy r10 = androidx.compose.foundation.layout.BoxKt.maybeCachedBoxMeasurePolicy(r2, r8)
            int r11 = r5 << 3
            r11 = r11 & 112(0x70, float:1.57E-43)
            r13 = r6
            r14 = r10
            r15 = r0
            r16 = 0
            r287 = r0
            r0 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r13, r0, r3)
            r3 = 0
            long r17 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r13, r3)
            int r0 = java.lang.Long.hashCode(r17)
            androidx.compose.runtime.CompositionLocalMap r3 = r13.getCurrentCompositionLocalMap()
            r17 = r0
            androidx.compose.ui.Modifier r0 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r13, r15)
            androidx.compose.ui.node.ComposeUiNode$Companion r18 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r18 = r18.getConstructor()
            r27 = r2
            int r2 = r11 << 6
            r2 = r2 & 896(0x380, float:1.256E-42)
            r63 = 6
            r2 = r2 | 6
            r30 = r18
            r18 = r13
            r32 = 0
            r273 = r4
            r4 = r18
            r18 = r6
            r6 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r6, r12)
            androidx.compose.runtime.Applier r6 = r4.getApplier()
            boolean r6 = r6 instanceof androidx.compose.runtime.Applier
            if (r6 != 0) goto L412e
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L412e:
            r4.startReusableNode()
            boolean r6 = r4.getInserting()
            if (r6 == 0) goto L413d
            r6 = r30
            r4.createNode(r6)
            goto L4142
        L413d:
            r6 = r30
            r4.useNode()
        L4142:
            androidx.compose.runtime.Composer r12 = androidx.compose.runtime.Updater.m4364constructorimpl(r4)
            r30 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r33 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r34 = r4
            kotlin.jvm.functions.Function2 r4 = r33.getSetMeasurePolicy()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r14, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r3, r4)
            java.lang.Integer r4 = java.lang.Integer.valueOf(r17)
            androidx.compose.ui.node.ComposeUiNode$Companion r33 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r35 = r3
            kotlin.jvm.functions.Function2 r3 = r33.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r12, r4, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r3 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r3 = r3.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r12, r3)
            androidx.compose.ui.node.ComposeUiNode$Companion r3 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r3 = r3.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r0, r3)
            int r3 = r2 >> 6
            r3 = r3 & 14
            r4 = r34
            r12 = 0
            r30 = r0
            r0 = 1833054614(0x6d423196, float:3.7562524E27)
            r33 = r2
            java.lang.String r2 = "C72@3469L9:Box.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r0, r2)
            androidx.compose.foundation.layout.BoxScopeInstance r0 = androidx.compose.foundation.layout.BoxScopeInstance.INSTANCE
            int r2 = r5 >> 6
            r2 = r2 & 112(0x70, float:1.57E-43)
            r63 = 6
            r2 = r2 | 6
            androidx.compose.foundation.layout.BoxScope r0 = (androidx.compose.foundation.layout.BoxScope) r0
            r44 = r4
            r47 = 0
            r48 = r0
            r0 = 787367732(0x2eee4734, float:1.0835635E-10)
            r49 = r2
            java.lang.String r2 = "C265@13462L43:BillingScreen.kt#7ez3px"
            r50 = r3
            r3 = r44
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r3, r0, r2)
            long r37 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            r45 = 0
            r46 = 61
            r36 = 0
            r39 = 0
            r40 = 0
            r42 = 0
            r43 = 0
            androidx.compose.material3.ProgressIndicatorKt.m2724CircularProgressIndicator4lLiAd8(r36, r37, r39, r40, r42, r43, r44, r45, r46)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r3)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r4)
            r34.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r34)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r13)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r18)
            r9.endReplaceGroup()
            r5 = r9
            r0 = r31
            r4 = r283
            r7 = r284
            r2 = r285
            goto L42a3
        L41ec:
            r273 = r4
            r0 = -410525166(0xffffffffe787e212, float:-1.2833795E24)
            r9.startReplaceGroup(r0)
            java.lang.String r0 = "274@13976L1475,268@13585L1866"
            androidx.compose.runtime.ComposerKt.sourceInformation(r9, r0)
            androidx.compose.foundation.lazy.grid.GridCells$Fixed r0 = new androidx.compose.foundation.lazy.grid.GridCells$Fixed
            r7 = 2
            r0.<init>(r7)
            androidx.compose.ui.Modifier$Companion r2 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r2 = (androidx.compose.ui.Modifier) r2
            r8 = 0
            r10 = 1
            r14 = 0
            androidx.compose.ui.Modifier r34 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r2, r14, r10, r8)
            r2 = 16
            r3 = 0
            float r4 = (float) r2
            float r2 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            androidx.compose.foundation.layout.PaddingValues r36 = androidx.compose.foundation.layout.PaddingKt.m809PaddingValues0680j_4(r2)
            androidx.compose.foundation.layout.Arrangement r2 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r3 = 12
            r4 = 0
            float r5 = (float) r3
            float r3 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r5)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r2 = r2.m686spacedBy0680j_4(r3)
            androidx.compose.foundation.layout.Arrangement r3 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r4 = 12
            r5 = 0
            float r7 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r7)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r3 = r3.m686spacedBy0680j_4(r4)
            r33 = r0
            androidx.compose.foundation.lazy.grid.GridCells r33 = (androidx.compose.foundation.lazy.grid.GridCells) r33
            r38 = r3
            androidx.compose.foundation.layout.Arrangement$Vertical r38 = (androidx.compose.foundation.layout.Arrangement.Vertical) r38
            r39 = r2
            androidx.compose.foundation.layout.Arrangement$Horizontal r39 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r39
            r0 = -705967287(0xffffffffd5ebcb49, float:-3.2407292E13)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r0, r6)
            r0 = r31
            r2 = r285
            boolean r3 = r2.changed(r0)
            r7 = r284
            boolean r4 = r2.changed(r7)
            r3 = r3 | r4
            r4 = r283
            boolean r5 = r2.changed(r4)
            r3 = r3 | r5
            boolean r5 = r2.changedInstance(r1)
            r3 = r3 | r5
            r5 = r9
            r6 = 0
            java.lang.Object r8 = r5.rememberedValue()
            r10 = 0
            if (r3 != 0) goto L4275
            androidx.compose.runtime.Composer$Companion r11 = androidx.compose.runtime.Composer.INSTANCE
            java.lang.Object r11 = r11.getEmpty()
            if (r8 != r11) goto L4274
            goto L4275
        L4274:
            goto L4280
        L4275:
            r11 = 0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda58 r12 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda58
            r12.<init>()
            r5.updateRememberedValue(r12)
            r8 = r12
        L4280:
            r43 = r8
            kotlin.jvm.functions.Function1 r43 = (kotlin.jvm.functions.Function1) r43
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r9)
            r35 = 0
            r37 = 0
            r40 = 0
            r41 = 0
            r42 = 0
            r45 = 1772592(0x1b0c30, float:2.48393E-39)
            r46 = 0
            r47 = 916(0x394, float:1.284E-42)
            r44 = r9
            androidx.compose.foundation.lazy.grid.LazyGridDslKt.LazyVerticalGrid(r33, r34, r35, r36, r37, r38, r39, r40, r41, r42, r43, r44, r45, r46, r47)
            r5 = r44
            r5.endReplaceGroup()
        L42a3:
            r5.endReplaceGroup()
            kotlin.Unit r3 = kotlin.Unit.INSTANCE
            r31 = r0
            r285 = r2
            r61 = r4
            r66 = r7
            goto L49ed
        L42b3:
            r268 = r287
            r67 = r0
            r2 = r7
            r270 = r30
            r0 = r31
            r4 = r61
            r274 = r62
            r7 = r66
            r174 = r114
            r271 = r144
            r273 = r170
            r144 = r5
            r5 = r9
            r114 = r108
            r170 = r115
            r115 = r102
            r108 = r106
            r102 = r95
            r95 = r97
            r106 = r99
            r97 = r80
            r99 = r88
            r80 = r20
            r88 = r82
            r20 = r120
            r82 = r79
            r120 = r107
            r79 = r73
            r107 = r101
            r73 = r72
            r101 = r90
            r72 = r69
            r90 = r81
            r81 = r19
            r19 = r53
            r69 = r68
            r9 = -414147702(0xffffffffe7509b8a, float:-9.851214E23)
            r5.startReplaceGroup(r9)
            java.lang.String r9 = "199@9909L3306"
            androidx.compose.runtime.ComposerKt.sourceInformation(r5, r9)
            androidx.compose.ui.Modifier$Companion r9 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r9 = (androidx.compose.ui.Modifier) r9
            r10 = 0
            r14 = 0
            r15 = 1
            androidx.compose.ui.Modifier r9 = androidx.compose.foundation.layout.SizeKt.fillMaxSize$default(r9, r14, r15, r10)
            r10 = 20
            r11 = 0
            float r14 = (float) r10
            float r10 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r14)
            androidx.compose.ui.Modifier r9 = androidx.compose.foundation.layout.PaddingKt.m816padding3ABfNKs(r9, r10)
            androidx.compose.foundation.layout.Arrangement r10 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r10 = r10.getCenter()
            androidx.compose.foundation.layout.Arrangement$Vertical r10 = (androidx.compose.foundation.layout.Arrangement.Vertical) r10
            androidx.compose.ui.Alignment$Companion r11 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r11 = r11.getCenterHorizontally()
            r14 = 438(0x1b6, float:6.14E-43)
            r15 = r5
            r16 = 0
            r0 = 1341605231(0x4ff7456f, float:8.2970455E9)
            java.lang.String r4 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r15, r0, r4)
            int r0 = r14 >> 3
            r0 = r0 & 14
            int r4 = r14 >> 3
            r4 = r4 & 112(0x70, float:1.57E-43)
            r0 = r0 | r4
            androidx.compose.ui.layout.MeasurePolicy r0 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r10, r11, r15, r0)
            int r4 = r14 << 3
            r4 = r4 & 112(0x70, float:1.57E-43)
            r287 = r15
            r30 = r0
            r33 = r9
            r34 = 0
            r35 = r0
            r7 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            r0 = r287
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r7, r3)
            r7 = 0
            long r36 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r7)
            int r7 = java.lang.Long.hashCode(r36)
            r287 = r7
            androidx.compose.runtime.CompositionLocalMap r7 = r0.getCurrentCompositionLocalMap()
            r36 = r9
            r33 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r37 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r37 = r37.getConstructor()
            r38 = r0
            int r0 = r4 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r39 = r37
            r37 = r38
            r40 = 0
            r41 = r4
            r4 = r37
            r37 = r9
            r9 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r4, r9, r12)
            androidx.compose.runtime.Applier r9 = r4.getApplier()
            boolean r9 = r9 instanceof androidx.compose.runtime.Applier
            if (r9 != 0) goto L43a6
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L43a6:
            r4.startReusableNode()
            boolean r9 = r4.getInserting()
            if (r9 == 0) goto L43b5
            r9 = r39
            r4.createNode(r9)
            goto L43ba
        L43b5:
            r9 = r39
            r4.useNode()
        L43ba:
            r39 = r4
            androidx.compose.runtime.Composer r4 = androidx.compose.runtime.Updater.m4364constructorimpl(r39)
            r42 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r43 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r44 = r9
            kotlin.jvm.functions.Function2 r9 = r43.getSetMeasurePolicy()
            r43 = r11
            r11 = r30
            androidx.compose.runtime.Updater.m4372setimpl(r4, r11, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r9 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r9 = r9.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r7, r9)
            java.lang.Integer r9 = java.lang.Integer.valueOf(r287)
            androidx.compose.ui.node.ComposeUiNode$Companion r30 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r45 = r7
            kotlin.jvm.functions.Function2 r7 = r30.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r4, r9, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r7 = r7.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r4, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r7 = r7.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r4, r10, r7)
            int r4 = r0 >> 6
            r4 = r4 & 14
            r7 = r39
            r9 = 0
            r30 = r0
            r0 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            r42 = r4
            java.lang.String r4 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r0, r4)
            androidx.compose.foundation.layout.ColumnScopeInstance r0 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r4 = r14 >> 6
            r4 = r4 & 112(0x70, float:1.57E-43)
            r63 = 6
            r4 = r4 | 6
            androidx.compose.foundation.layout.ColumnScope r0 = (androidx.compose.foundation.layout.ColumnScope) r0
            r197 = r7
            r46 = 0
            r47 = r0
            r0 = -596995136(0xffffffffdc6a93c0, float:-2.6411039E17)
            r48 = r4
            java.lang.String r4 = "C206@10238L367,215@10631L2562:BillingScreen.kt#7ez3px"
            r49 = r7
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r0, r4)
            long r177 = com.example.sasloopmanager.theme.ColorKt.getTextSecondary()
            r0 = 11
            long r180 = androidx.compose.ui.unit.TextUnitKt.getSp(r0)
            androidx.compose.ui.text.font.FontWeight$Companion r0 = androidx.compose.ui.text.font.FontWeight.INSTANCE
            androidx.compose.ui.text.font.FontWeight r183 = r0.getBold()
            r32 = 2
            long r185 = androidx.compose.ui.unit.TextUnitKt.getSp(r32)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            r124 = r0
            androidx.compose.ui.Modifier r124 = (androidx.compose.ui.Modifier) r124
            r0 = 24
            r4 = 0
            r32 = r4
            float r4 = (float) r0
            float r128 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r4)
            r129 = 7
            r130 = 0
            r125 = 0
            r126 = 0
            r127 = 0
            androidx.compose.ui.Modifier r176 = androidx.compose.foundation.layout.PaddingKt.m820paddingqDBjuR0$default(r124, r125, r126, r127, r128, r129, r130)
            java.lang.String r175 = "CHOOSE TERMINAL FLOW"
            r179 = 0
            r182 = 0
            r184 = 0
            r187 = 0
            r188 = 0
            r189 = 0
            r191 = 0
            r192 = 0
            r193 = 0
            r194 = 0
            r195 = 0
            r196 = 0
            r198 = 102260790(0x6186036, float:2.8658707E-35)
            r199 = 0
            r200 = 261800(0x3fea8, float:3.6686E-40)
            androidx.compose.material3.TextKt.m3069TextNvy7gAk(r175, r176, r177, r179, r180, r182, r183, r184, r185, r187, r188, r189, r191, r192, r193, r194, r195, r196, r197, r198, r199, r200)
            androidx.compose.foundation.layout.Arrangement r0 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r4 = 16
            r7 = 0
            r32 = r7
            float r7 = (float) r4
            float r4 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r7)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r0 = r0.m686spacedBy0680j_4(r4)
            androidx.compose.foundation.layout.Arrangement$Vertical r0 = (androidx.compose.foundation.layout.Arrangement.Vertical) r0
            r4 = 48
            r7 = r197
            r32 = 0
            r50 = r9
            r9 = 1341605231(0x4ff7456f, float:8.2970455E9)
            r51 = r10
            java.lang.String r10 = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r9, r10)
            androidx.compose.ui.Modifier$Companion r9 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r9 = (androidx.compose.ui.Modifier) r9
            androidx.compose.ui.Alignment$Companion r10 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Horizontal r10 = r10.getStart()
            int r52 = r4 >> 3
            r52 = r52 & 14
            int r53 = r4 >> 3
            r53 = r53 & 112(0x70, float:1.57E-43)
            r62 = r9
            r9 = r52 | r53
            androidx.compose.ui.layout.MeasurePolicy r9 = androidx.compose.foundation.layout.ColumnKt.columnMeasurePolicy(r0, r10, r7, r9)
            int r52 = r4 << 3
            r52 = r52 & 112(0x70, float:1.57E-43)
            r53 = r9
            r68 = r62
            r75 = r7
            r121 = 0
            r122 = r0
            r0 = r75
            r7 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r7, r3)
            r7 = 0
            long r124 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r7)
            int r7 = java.lang.Long.hashCode(r124)
            r124 = r7
            androidx.compose.runtime.CompositionLocalMap r7 = r0.getCurrentCompositionLocalMap()
            r125 = r9
            r9 = r68
            r68 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r126 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r126 = r126.getConstructor()
            r127 = r0
            int r0 = r52 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r128 = r127
            r129 = r126
            r126 = 0
            r130 = r9
            r9 = r128
            r128 = r11
            r11 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r11, r12)
            androidx.compose.runtime.Applier r11 = r9.getApplier()
            boolean r11 = r11 instanceof androidx.compose.runtime.Applier
            if (r11 != 0) goto L4529
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L4529:
            r9.startReusableNode()
            boolean r11 = r9.getInserting()
            if (r11 == 0) goto L4538
            r11 = r129
            r9.createNode(r11)
            goto L453d
        L4538:
            r11 = r129
            r9.useNode()
        L453d:
            r129 = r9
            androidx.compose.runtime.Composer r9 = androidx.compose.runtime.Updater.m4364constructorimpl(r129)
            r131 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r132 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r133 = r11
            kotlin.jvm.functions.Function2 r11 = r132.getSetMeasurePolicy()
            r132 = r14
            r14 = r53
            androidx.compose.runtime.Updater.m4372setimpl(r9, r14, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r11 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r11 = r11.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r7, r11)
            java.lang.Integer r11 = java.lang.Integer.valueOf(r124)
            androidx.compose.ui.node.ComposeUiNode$Companion r53 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r134 = r7
            kotlin.jvm.functions.Function2 r7 = r53.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r9, r11, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r7 = r7.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r9, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r7 = r7.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r10, r7)
            int r7 = r0 >> 6
            r7 = r7 & 14
            r9 = r129
            r11 = 0
            r53 = r0
            r0 = 2093002350(0x7cc0ae6e, float:8.003671E36)
            r131 = r7
            java.lang.String r7 = "C89@4557L9:Column.kt#2w3rfo"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r0, r7)
            androidx.compose.foundation.layout.ColumnScopeInstance r0 = androidx.compose.foundation.layout.ColumnScopeInstance.INSTANCE
            int r7 = r4 >> 6
            r7 = r7 & 112(0x70, float:1.57E-43)
            r63 = 6
            r7 = r7 | 6
            androidx.compose.foundation.layout.ColumnScope r0 = (androidx.compose.foundation.layout.ColumnScope) r0
            r135 = r9
            r136 = 0
            r137 = r0
            r0 = 344023377(0x14816151, float:1.3064056E-26)
            r138 = r4
            java.lang.String r4 = "C216@10719L1213,237@11961L1206:BillingScreen.kt#7ez3px"
            r139 = r7
            r7 = r135
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r0, r4)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r140 = r9
            r4 = 0
            r7 = 0
            r9 = 1
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r0, r4, r9, r7)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r7 = 16
            r9 = 0
            r141 = r0
            float r0 = (float) r7
            float r0 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r0)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r0 = r4.m686spacedBy0680j_4(r0)
            androidx.compose.foundation.layout.Arrangement$Horizontal r0 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r0
            r74 = 54
            r4 = r74
            r7 = r135
            r9 = 0
            r142 = r9
            r9 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r9, r13)
            androidx.compose.ui.Alignment$Companion r9 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r9 = r9.getTop()
            int r143 = r4 >> 3
            r143 = r143 & 14
            int r145 = r4 >> 3
            r145 = r145 & 112(0x70, float:1.57E-43)
            r146 = r10
            r10 = r143 | r145
            androidx.compose.ui.layout.MeasurePolicy r10 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r0, r9, r7, r10)
            int r143 = r4 << 3
            r143 = r143 & 112(0x70, float:1.57E-43)
            r145 = r141
            r147 = r10
            r148 = r7
            r149 = 0
            r150 = r0
            r0 = r148
            r7 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r7, r3)
            r7 = 0
            long r151 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r7)
            int r7 = java.lang.Long.hashCode(r151)
            r151 = r7
            androidx.compose.runtime.CompositionLocalMap r7 = r0.getCurrentCompositionLocalMap()
            r152 = r9
            r9 = r145
            r145 = r10
            androidx.compose.ui.Modifier r10 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r9)
            androidx.compose.ui.node.ComposeUiNode$Companion r153 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r153 = r153.getConstructor()
            r154 = r0
            int r0 = r143 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r155 = r154
            r156 = r153
            r153 = 0
            r157 = r9
            r9 = r155
            r155 = r11
            r11 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r11, r12)
            androidx.compose.runtime.Applier r11 = r9.getApplier()
            boolean r11 = r11 instanceof androidx.compose.runtime.Applier
            if (r11 != 0) goto L4656
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L4656:
            r9.startReusableNode()
            boolean r11 = r9.getInserting()
            if (r11 == 0) goto L4665
            r11 = r156
            r9.createNode(r11)
            goto L466a
        L4665:
            r11 = r156
            r9.useNode()
        L466a:
            r156 = r9
            androidx.compose.runtime.Composer r9 = androidx.compose.runtime.Updater.m4364constructorimpl(r156)
            r158 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r159 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r160 = r11
            kotlin.jvm.functions.Function2 r11 = r159.getSetMeasurePolicy()
            r159 = r14
            r14 = r147
            androidx.compose.runtime.Updater.m4372setimpl(r9, r14, r11)
            androidx.compose.ui.node.ComposeUiNode$Companion r11 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r11 = r11.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r7, r11)
            java.lang.Integer r11 = java.lang.Integer.valueOf(r151)
            androidx.compose.ui.node.ComposeUiNode$Companion r147 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r161 = r7
            kotlin.jvm.functions.Function2 r7 = r147.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r9, r11, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r7 = r7.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r9, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r7 = r7.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r9, r10, r7)
            int r7 = r0 >> 6
            r7 = r7 & 14
            r9 = r156
            r11 = 0
            r147 = r0
            r0 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r9, r0, r8)
            androidx.compose.foundation.layout.RowScopeInstance r0 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r158 = r4 >> 6
            r158 = r158 & 112(0x70, float:1.57E-43)
            r63 = 6
            r158 = r158 | 6
            r162 = r0
            androidx.compose.foundation.layout.RowScope r162 = (androidx.compose.foundation.layout.RowScope) r162
            r0 = r9
            r168 = 0
            r169 = r4
            r4 = 346335043(0x14a4a743, float:1.6625741E-26)
            r171 = r7
            java.lang.String r7 = "C226@11314L41,220@10940L449,234@11816L52,228@11422L480:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r4, r7)
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            r163 = r4
            androidx.compose.ui.Modifier r163 = (androidx.compose.ui.Modifier) r163
            r166 = 2
            r167 = 0
            r164 = 1065353216(0x3f800000, float:1.0)
            r165 = 0
            androidx.compose.ui.Modifier r175 = androidx.compose.foundation.layout.RowScope.weight$default(r162, r163, r164, r165, r166, r167)
            androidx.compose.material.icons.Icons r4 = androidx.compose.material.icons.Icons.INSTANCE
            androidx.compose.material.icons.Icons$Filled r4 = r4.getDefault()
            androidx.compose.ui.graphics.vector.ImageVector r178 = androidx.compose.material.icons.filled.RestaurantKt.getRestaurant(r4)
            long r179 = com.example.sasloopmanager.theme.ColorKt.getSaSGreen()
            r4 = 2089393127(0x7c899be7, float:5.716054E36)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r4, r6)
            boolean r4 = r2.changedInstance(r1)
            r7 = r0
            r163 = 0
            r182 = r0
            java.lang.Object r0 = r7.rememberedValue()
            r164 = 0
            if (r4 != 0) goto L471e
            androidx.compose.runtime.Composer$Companion r165 = androidx.compose.runtime.Composer.INSTANCE
            r166 = r4
            java.lang.Object r4 = r165.getEmpty()
            if (r0 != r4) goto L471d
            goto L4720
        L471d:
            goto L472d
        L471e:
            r166 = r4
        L4720:
            r4 = 0
            r165 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda54 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda54
            r0.<init>()
            r7.updateRememberedValue(r0)
        L472d:
            r181 = r0
            kotlin.jvm.functions.Function0 r181 = (kotlin.jvm.functions.Function0) r181
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r182)
            java.lang.String r176 = "Dine In"
            java.lang.String r177 = "Table KOTs & Bills"
            r183 = 432(0x1b0, float:6.05E-43)
            r184 = 0
            m8419FlowCardFHprtrg(r175, r176, r177, r178, r179, r181, r182, r183, r184)
            r0 = r182
            androidx.compose.ui.Modifier$Companion r4 = androidx.compose.ui.Modifier.INSTANCE
            r163 = r4
            androidx.compose.ui.Modifier r163 = (androidx.compose.ui.Modifier) r163
            r166 = 2
            r167 = 0
            r164 = 1065353216(0x3f800000, float:1.0)
            r165 = 0
            androidx.compose.ui.Modifier r175 = androidx.compose.foundation.layout.RowScope.weight$default(r162, r163, r164, r165, r166, r167)
            androidx.compose.material.icons.Icons r4 = androidx.compose.material.icons.Icons.INSTANCE
            androidx.compose.material.icons.Icons$Filled r4 = r4.getDefault()
            androidx.compose.ui.graphics.vector.ImageVector r178 = androidx.compose.material.icons.filled.LocalShippingKt.getLocalShipping(r4)
            long r179 = com.example.sasloopmanager.theme.ColorKt.getStatusInfo()
            r4 = 2089409202(0x7c89dab2, float:5.726243E36)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r4, r6)
            boolean r4 = r2.changedInstance(r1)
            r7 = r0
            r163 = 0
            java.lang.Object r0 = r7.rememberedValue()
            r164 = 0
            if (r4 != 0) goto L4786
            androidx.compose.runtime.Composer$Companion r165 = androidx.compose.runtime.Composer.INSTANCE
            r166 = r4
            java.lang.Object r4 = r165.getEmpty()
            if (r0 != r4) goto L4785
            goto L4788
        L4785:
            goto L4795
        L4786:
            r166 = r4
        L4788:
            r4 = 0
            r165 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda55 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda55
            r0.<init>()
            r7.updateRememberedValue(r0)
        L4795:
            r181 = r0
            kotlin.jvm.functions.Function0 r181 = (kotlin.jvm.functions.Function0) r181
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r182)
            java.lang.String r176 = "Takeaway / Delivery"
            java.lang.String r177 = "Counter & Home orders"
            r183 = 432(0x1b0, float:6.05E-43)
            r184 = 0
            m8419FlowCardFHprtrg(r175, r176, r177, r178, r179, r181, r182, r183, r184)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r182)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r9)
            r156.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r156)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r154)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r148)
            androidx.compose.ui.Modifier$Companion r0 = androidx.compose.ui.Modifier.INSTANCE
            androidx.compose.ui.Modifier r0 = (androidx.compose.ui.Modifier) r0
            r9 = 1
            r10 = 0
            r14 = 0
            androidx.compose.ui.Modifier r0 = androidx.compose.foundation.layout.SizeKt.fillMaxWidth$default(r0, r14, r9, r10)
            androidx.compose.foundation.layout.Arrangement r4 = androidx.compose.foundation.layout.Arrangement.INSTANCE
            r7 = 16
            r9 = 0
            float r10 = (float) r7
            float r7 = androidx.compose.ui.unit.Dp.m7902constructorimpl(r10)
            androidx.compose.foundation.layout.Arrangement$HorizontalOrVertical r4 = r4.m686spacedBy0680j_4(r7)
            androidx.compose.foundation.layout.Arrangement$Horizontal r4 = (androidx.compose.foundation.layout.Arrangement.Horizontal) r4
            r74 = 54
            r7 = r135
            r9 = 0
            r11 = 844473419(0x3255a44b, float:1.2435588E-8)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r11, r13)
            androidx.compose.ui.Alignment$Companion r10 = androidx.compose.ui.Alignment.INSTANCE
            androidx.compose.ui.Alignment$Vertical r10 = r10.getTop()
            int r11 = r74 >> 3
            r11 = r11 & 14
            int r13 = r74 >> 3
            r13 = r13 & 112(0x70, float:1.57E-43)
            r11 = r11 | r13
            androidx.compose.ui.layout.MeasurePolicy r11 = androidx.compose.foundation.layout.RowKt.rowMeasurePolicy(r4, r10, r7, r11)
            int r13 = r74 << 3
            r13 = r13 & 112(0x70, float:1.57E-43)
            r14 = r0
            r18 = r11
            r27 = r7
            r58 = 0
            r118 = r0
            r17 = r4
            r0 = r27
            r4 = -1159599143(0xffffffffbae1ebd9, float:-0.0017236426)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r4, r3)
            r3 = 0
            long r3 = androidx.compose.runtime.ComposablesKt.getCurrentCompositeKeyHashCode(r0, r3)
            int r3 = java.lang.Long.hashCode(r3)
            androidx.compose.runtime.CompositionLocalMap r4 = r0.getCurrentCompositionLocalMap()
            r27 = r3
            androidx.compose.ui.Modifier r3 = androidx.compose.ui.ComposedModifierKt.materializeModifier(r0, r14)
            androidx.compose.ui.node.ComposeUiNode$Companion r59 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function0 r59 = r59.getConstructor()
            r141 = r0
            int r0 = r13 << 6
            r0 = r0 & 896(0x380, float:1.256E-42)
            r63 = 6
            r0 = r0 | 6
            r142 = r141
            r143 = r59
            r59 = 0
            r145 = r7
            r77 = r9
            r7 = r142
            r9 = -553112988(0xffffffffdf082a64, float:-9.811765E18)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r9, r12)
            androidx.compose.runtime.Applier r9 = r7.getApplier()
            boolean r9 = r9 instanceof androidx.compose.runtime.Applier
            if (r9 != 0) goto L4852
            androidx.compose.runtime.ComposablesKt.invalidApplier()
        L4852:
            r7.startReusableNode()
            boolean r9 = r7.getInserting()
            if (r9 == 0) goto L4861
            r9 = r143
            r7.createNode(r9)
            goto L4866
        L4861:
            r9 = r143
            r7.useNode()
        L4866:
            androidx.compose.runtime.Composer r12 = androidx.compose.runtime.Updater.m4364constructorimpl(r7)
            r142 = 0
            androidx.compose.ui.node.ComposeUiNode$Companion r143 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r147 = r7
            kotlin.jvm.functions.Function2 r7 = r143.getSetMeasurePolicy()
            r143 = r9
            r9 = r18
            androidx.compose.runtime.Updater.m4372setimpl(r12, r9, r7)
            androidx.compose.ui.node.ComposeUiNode$Companion r7 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r7 = r7.getSetResolvedCompositionLocals()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r4, r7)
            java.lang.Integer r7 = java.lang.Integer.valueOf(r27)
            androidx.compose.ui.node.ComposeUiNode$Companion r18 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            r148 = r4
            kotlin.jvm.functions.Function2 r4 = r18.getSetCompositeKeyHash()
            androidx.compose.runtime.Updater.m4368initimpl(r12, r7, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function1 r4 = r4.getApplyOnDeactivatedNodeAssertion()
            androidx.compose.runtime.Updater.m4370reconcileimpl(r12, r4)
            androidx.compose.ui.node.ComposeUiNode$Companion r4 = androidx.compose.ui.node.ComposeUiNode.INSTANCE
            kotlin.jvm.functions.Function2 r4 = r4.getSetModifier()
            androidx.compose.runtime.Updater.m4372setimpl(r12, r3, r4)
            int r4 = r0 >> 6
            r4 = r4 & 14
            r7 = r147
            r12 = 0
            r18 = r0
            r0 = 1456264949(0x56ccd6f5, float:1.12611803E14)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r7, r0, r8)
            androidx.compose.foundation.layout.RowScopeInstance r0 = androidx.compose.foundation.layout.RowScopeInstance.INSTANCE
            int r8 = r74 >> 6
            r8 = r8 & 112(0x70, float:1.57E-43)
            r63 = 6
            r8 = r8 | 6
            r149 = r0
            androidx.compose.foundation.layout.RowScope r149 = (androidx.compose.foundation.layout.RowScope) r149
            r0 = r7
            r63 = 0
            r123 = r3
            r3 = 1273290145(0x4be4dda1, float:2.999789E7)
            r142 = r4
            java.lang.String r4 = "C247@12567L45,241@12182L464,255@13060L43,249@12679L458:BillingScreen.kt#7ez3px"
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r3, r4)
            androidx.compose.ui.Modifier$Companion r3 = androidx.compose.ui.Modifier.INSTANCE
            r150 = r3
            androidx.compose.ui.Modifier r150 = (androidx.compose.ui.Modifier) r150
            r153 = 2
            r154 = 0
            r151 = 1065353216(0x3f800000, float:1.0)
            r152 = 0
            androidx.compose.ui.Modifier r160 = androidx.compose.foundation.layout.RowScope.weight$default(r149, r150, r151, r152, r153, r154)
            androidx.compose.material.icons.Icons r3 = androidx.compose.material.icons.Icons.INSTANCE
            androidx.compose.material.icons.Icons$Filled r3 = r3.getDefault()
            androidx.compose.ui.graphics.vector.ImageVector r163 = androidx.compose.material.icons.filled.FlashOnKt.getFlashOn(r3)
            long r164 = com.example.sasloopmanager.theme.ColorKt.getSaSGreenLight()
            r3 = -1621482700(0xffffffff9f5a2334, float:-4.6192415E-20)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r3, r6)
            boolean r3 = r2.changedInstance(r1)
            r4 = r0
            r150 = 0
            r167 = r0
            java.lang.Object r0 = r4.rememberedValue()
            r151 = 0
            if (r3 != 0) goto L4918
            androidx.compose.runtime.Composer$Companion r152 = androidx.compose.runtime.Composer.INSTANCE
            r153 = r3
            java.lang.Object r3 = r152.getEmpty()
            if (r0 != r3) goto L4917
            goto L491a
        L4917:
            goto L4927
        L4918:
            r153 = r3
        L491a:
            r3 = 0
            r152 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda56 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda56
            r0.<init>()
            r4.updateRememberedValue(r0)
        L4927:
            r166 = r0
            kotlin.jvm.functions.Function0 r166 = (kotlin.jvm.functions.Function0) r166
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r167)
            java.lang.String r161 = "Quick Bill"
            java.lang.String r162 = "Direct billing & payment"
            r168 = 432(0x1b0, float:6.05E-43)
            r169 = 0
            m8419FlowCardFHprtrg(r160, r161, r162, r163, r164, r166, r167, r168, r169)
            r0 = r167
            androidx.compose.ui.Modifier$Companion r3 = androidx.compose.ui.Modifier.INSTANCE
            r150 = r3
            androidx.compose.ui.Modifier r150 = (androidx.compose.ui.Modifier) r150
            r153 = 2
            r154 = 0
            r151 = 1065353216(0x3f800000, float:1.0)
            r152 = 0
            androidx.compose.ui.Modifier r160 = androidx.compose.foundation.layout.RowScope.weight$default(r149, r150, r151, r152, r153, r154)
            androidx.compose.material.icons.Icons r3 = androidx.compose.material.icons.Icons.INSTANCE
            androidx.compose.material.icons.Icons$Filled r3 = r3.getDefault()
            androidx.compose.ui.graphics.vector.ImageVector r163 = androidx.compose.material.icons.filled.EventNoteKt.getEventNote(r3)
            long r164 = com.example.sasloopmanager.theme.ColorKt.getStatusWarning()
            r3 = -1621466926(0xffffffff9f5a60d2, float:-4.6243384E-20)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerStart(r0, r3, r6)
            boolean r3 = r2.changedInstance(r1)
            r4 = r0
            r6 = 0
            java.lang.Object r0 = r4.rememberedValue()
            r150 = 0
            if (r3 != 0) goto L4980
            androidx.compose.runtime.Composer$Companion r151 = androidx.compose.runtime.Composer.INSTANCE
            r285 = r2
            java.lang.Object r2 = r151.getEmpty()
            if (r0 != r2) goto L497f
            goto L4983
        L497f:
            goto L4990
        L4980:
            r285 = r2
        L4983:
            r2 = 0
            r151 = r0
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda57 r0 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda57
            r0.<init>()
            r4.updateRememberedValue(r0)
        L4990:
            r166 = r0
            kotlin.jvm.functions.Function0 r166 = (kotlin.jvm.functions.Function0) r166
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r167)
            java.lang.String r161 = "Pre-Order"
            java.lang.String r162 = "Bookings & advances"
            r168 = 432(0x1b0, float:6.05E-43)
            r169 = 0
            m8419FlowCardFHprtrg(r160, r161, r162, r163, r164, r166, r167, r168, r169)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r167)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r7)
            r147.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r147)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r141)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r145)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r135)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r140)
            r129.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r129)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r127)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r75)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r197)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r49)
            r39.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r39)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r38)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r15)
            r5.endReplaceGroup()
            kotlin.Unit r0 = kotlin.Unit.INSTANCE
        L49ed:
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r5)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r174)
            r170.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r170)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r115)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r102)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r101)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r99)
            r95.endNode()
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r95)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r97)
            androidx.compose.runtime.ComposerKt.sourceInformationMarkerEnd(r80)
            boolean r0 = androidx.compose.runtime.ComposerKt.isTraceInProgress()
            if (r0 == 0) goto L4a2d
            androidx.compose.runtime.ComposerKt.traceEventEnd()
            goto L4a2d
        L4a25:
            r60 = r0
            r285 = r11
            r285.skipToGroupEnd()
        L4a2d:
            androidx.compose.runtime.ScopeUpdateScope r0 = r285.endRestartGroup()
            if (r0 == 0) goto L4a3e
            com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda51 r2 = new com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda51
            r6 = r288
            r2.<init>()
            r0.updateScope(r2)
            goto L4a40
        L4a3e:
            r6 = r288
        L4a40:
            return
        */
        throw new UnsupportedOperationException("Method not decompiled: com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.Composer, int):void");
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final List<MenuItem> BillingScreen$lambda$0(State<? extends List<MenuItem>> state) {
        return (List) state.getValue();
    }

    private static final List<CategoryItem> BillingScreen$lambda$1(State<? extends List<CategoryItem>> state) {
        return (List) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$2(State<String> state) {
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
    public static final BillingFlowState BillingScreen$lambda$8(State<? extends BillingFlowState> state) {
        return (BillingFlowState) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final String BillingScreen$lambda$9(State<String> state) {
        return (String) state.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final TableItem BillingScreen$lambda$10(State<TableItem> state) {
        return (TableItem) state.getValue();
    }

    /* JADX DEBUG: Marked for inline */
    /* JADX DEBUG: Method not inlined, still used in: [com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.Composer, int):void] */
    private static final boolean BillingScreen$lambda$11(State<Boolean> state) {
        return ((Boolean) state.getValue()).booleanValue();
    }

    private static final String BillingScreen$lambda$12(State<String> state) {
        return (String) state.getValue();
    }

    private static final Boolean BillingScreen$lambda$13(State<Boolean> state) {
        return (Boolean) state.getValue();
    }

    private static final String BillingScreen$lambda$15(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$18(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$21(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$24(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$27(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX DEBUG: Marked for inline */
    /* JADX DEBUG: Method not inlined, still used in: [com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.Composer, int):void] */
    private static final String BillingScreen$lambda$30(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX DEBUG: Marked for inline */
    /* JADX DEBUG: Method not inlined, still used in: [com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.Composer, int):void] */
    private static final String BillingScreen$lambda$33(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX DEBUG: Marked for inline */
    /* JADX DEBUG: Method not inlined, still used in: [com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.Composer, int):void] */
    private static final String BillingScreen$lambda$36(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    private static final String BillingScreen$lambda$39(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX DEBUG: Marked for inline */
    /* JADX DEBUG: Method not inlined, still used in: [com.example.sasloopmanager.BillingScreenKt.BillingScreen(com.example.sasloopmanager.BillingViewModel, androidx.compose.runtime.Composer, int):void] */
    private static final String BillingScreen$lambda$42(MutableState<String> mutableState) {
        return mutableState.getValue();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$46$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit BillingScreen$lambda$47(final BillingViewModel $billingViewModel, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C116@6037L40,117@6123L41,115@5995L268:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-318595569, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous> (BillingScreen.kt:115)");
            }
            ComposerKt.sourceInformationMarkerStart($composer, -1227661833, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda2
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$47$0$0;
                        BillingScreen$lambda$47$0$0 = BillingScreenKt.BillingScreen$lambda$47$0$0(BillingViewModel.this);
                        return BillingScreen$lambda$47$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.TextButton((Function0) rememberedValue, null, false, null, ButtonDefaults.INSTANCE.m2132textButtonColorsro_MJ88(0L, ColorKt.getSaSGreen(), 0L, 0L, $composer, ButtonDefaults.$stable << 12, 13), null, null, null, null, ComposableSingletons$BillingScreenKt.INSTANCE.m8428getLambda$1663291764$app(), $composer, 805306368, 494);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$47$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.resetOrderSuccess();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.goBack();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.fetchTablesAndActiveOrders();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.clearCart();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$1$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("DINEIN");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$1$0$0$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("TAKEAWAY_DELIVERY");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$1$0$1$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("QUICK_BILL");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$1$0$1$1$0(BillingViewModel $billingViewModel) {
        $billingViewModel.selectFlow("PREORDER");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$3$0(State $tables$delegate, final BillingViewModel $billingViewModel, final State $activeOrders$delegate, final State $catalog$delegate, LazyGridScope LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter(LazyVerticalGrid, "$this$LazyVerticalGrid");
        final List BillingScreen$lambda$6 = BillingScreen$lambda$6($tables$delegate);
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$3$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((TableItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(TableItem tableItem) {
                return null;
            }
        };
        LazyVerticalGrid.items(BillingScreen$lambda$6.size(), null, null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$3$0$$inlined$items$default$4
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object] */
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(BillingScreen$lambda$6.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new Function4<LazyGridItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$3$0$$inlined$items$default$5
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object, java.lang.Object, java.lang.Object, java.lang.Object] */
            /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyGridItemScope lazyGridItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyGridItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyGridItemScope $this$items, int it, Composer $composer, int $changed) {
                List BillingScreen$lambda$7;
                Object obj;
                boolean z;
                boolean z2;
                int i;
                Iterable BillingScreen$lambda$0;
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
                    int i2 = $dirty & 14;
                    final TableItem tableItem = (TableItem) BillingScreen$lambda$6.get(it);
                    $composer.startReplaceGroup(-1406319455);
                    ComposerKt.sourceInformation($composer, "CN(table)*295@15322L39,283@14471L924:BillingScreen.kt#7ez3px");
                    BillingScreen$lambda$7 = BillingScreenKt.BillingScreen$lambda$7($activeOrders$delegate);
                    Iterator it2 = BillingScreen$lambda$7.iterator();
                    while (true) {
                        if (!it2.hasNext()) {
                            obj = null;
                            break;
                        }
                        obj = it2.next();
                        Order order = (Order) obj;
                        if (Intrinsics.areEqual(order.getTableNumber(), tableItem.getTableName()) || Intrinsics.areEqual(order.getTableName(), tableItem.getTableName()) || Intrinsics.areEqual(order.getTableNumber(), String.valueOf(tableItem.getId()))) {
                            break;
                        }
                    }
                    Order order2 = (Order) obj;
                    boolean z3 = order2 != null;
                    Double totalPrice = order2 != null ? order2.getTotalPrice() : null;
                    if ((order2 != null ? order2.getItems() : null) != null) {
                        BillingScreen$lambda$0 = BillingScreenKt.BillingScreen$lambda$0($catalog$delegate);
                        Collection arrayList = new ArrayList();
                        for (Object obj2 : BillingScreen$lambda$0) {
                            String json = new Gson().toJson(order2.getItems());
                            Intrinsics.checkNotNull(json);
                            String lowerCase = json.toLowerCase(Locale.ROOT);
                            Intrinsics.checkNotNullExpressionValue(lowerCase, "toLowerCase(...)");
                            int $dirty2 = $dirty;
                            String lowerCase2 = ((MenuItem) obj2).getProductName().toLowerCase(Locale.ROOT);
                            Intrinsics.checkNotNullExpressionValue(lowerCase2, "toLowerCase(...)");
                            if (StringsKt.contains$default((CharSequence) lowerCase, (CharSequence) lowerCase2, false, 2, (Object) null)) {
                                arrayList.add(obj2);
                            }
                            $dirty = $dirty2;
                        }
                        z2 = false;
                        z = true;
                        i = RangesKt.coerceAtLeast(((List) arrayList).size(), 1);
                    } else {
                        z = true;
                        z2 = false;
                        i = 0;
                    }
                    ComposerKt.sourceInformationMarkerStart($composer, 1894336501, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance = $composer.changedInstance($billingViewModel);
                    if ((((i2 & 112) ^ 48) <= 32 || !$composer.changed(tableItem)) && (i2 & 48) != 32) {
                        z = z2;
                    }
                    boolean z4 = changedInstance | z;
                    Object rememberedValue = $composer.rememberedValue();
                    if (z4 || rememberedValue == Composer.INSTANCE.getEmpty()) {
                        final BillingViewModel billingViewModel = $billingViewModel;
                        Object obj3 = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$4$1$4$1$1$1$1
                            /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
                            @Override // kotlin.jvm.functions.Function0
                            public /* bridge */ /* synthetic */ Unit invoke() {
                                invoke2();
                                return Unit.INSTANCE;
                            }

                            /* JADX DEBUG: Possible override for method kotlin.jvm.functions.Function0.invoke()Ljava/lang/Object; */
                            /* renamed from: invoke, reason: avoid collision after fix types in other method */
                            public final void invoke2() {
                                BillingViewModel.this.selectTable(tableItem);
                            }
                        };
                        $composer.updateRememberedValue(obj3);
                        rememberedValue = obj3;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    BillingScreenKt.TableCard(tableItem, z3, totalPrice, i, (Function0) rememberedValue, $composer, (i2 >> 3) & 14);
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
    public static final Unit BillingScreen$lambda$48$0$4$0(final MutableState $activeSubTab$delegate, final State $cart$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C313@16139L25,314@16205L411,311@16025L621,325@16792L28,326@16861L1689,323@16675L1905:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1888427144, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:311)");
            }
            boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$15($activeSubTab$delegate), "MENU");
            ComposerKt.sourceInformationMarkerStart($composer, 1992685457, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda21
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$48$0$4$0$0$0;
                        BillingScreen$lambda$48$0$4$0$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$0$0$0(MutableState.this);
                        return BillingScreen$lambda$48$0$4$0$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(areEqual, (Function0) rememberedValue, null, false, ComposableLambdaKt.rememberComposableLambda(989047634, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda22
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj2, Object obj3) {
                    Unit BillingScreen$lambda$48$0$4$0$1;
                    BillingScreen$lambda$48$0$4$0$1 = BillingScreenKt.BillingScreen$lambda$48$0$4$0$1(MutableState.this, (Composer) obj2, ((Integer) obj3).intValue());
                    return BillingScreen$lambda$48$0$4$0$1;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24576, 492);
            boolean areEqual2 = Intrinsics.areEqual(BillingScreen$lambda$15($activeSubTab$delegate), "BILLING");
            ComposerKt.sourceInformationMarkerStart($composer, 1992706356, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed2 = $composer.changed($activeSubTab$delegate);
            Object rememberedValue2 = $composer.rememberedValue();
            if (changed2 || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                Object obj2 = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda23
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$48$0$4$0$2$0;
                        BillingScreen$lambda$48$0$4$0$2$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$0$2$0(MutableState.this);
                        return BillingScreen$lambda$48$0$4$0$2$0;
                    }
                };
                $composer.updateRememberedValue(obj2);
                rememberedValue2 = obj2;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            TabKt.m2960TabwqdebIU(areEqual2, (Function0) rememberedValue2, null, false, ComposableLambdaKt.rememberComposableLambda(1482215227, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda24
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj3, Object obj4) {
                    Unit BillingScreen$lambda$48$0$4$0$3;
                    BillingScreen$lambda$48$0$4$0$3 = BillingScreenKt.BillingScreen$lambda$48$0$4$0$3(MutableState.this, $cart$delegate, (Composer) obj3, ((Integer) obj4).intValue());
                    return BillingScreen$lambda$48$0$4$0$3;
                }
            }, $composer, 54), null, 0L, 0L, null, $composer, 24576, 492);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$0$0$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("MENU");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$0$1(MutableState $activeSubTab$delegate, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C315@16243L339:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(989047634, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:315)");
            }
            FontWeight bold = FontWeight.INSTANCE.getBold();
            TextKt.m3069TextNvy7gAk("Menu / KOT", null, Intrinsics.areEqual(BillingScreen$lambda$15($activeSubTab$delegate), "MENU") ? Color.INSTANCE.m5131getWhite0d7_KjU() : ColorKt.getTextSecondary(), null, TextUnitKt.getSp(13), null, bold, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$0$2$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("BILLING");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$0$3(MutableState $activeSubTab$delegate, final State $cart$delegate, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C327@16899L1617:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1482215227, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:327)");
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
            ComposerKt.sourceInformationMarkerStart($composer, -1779672681, "C328@16993L368:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk("Billing & Settle", null, Intrinsics.areEqual(BillingScreen$lambda$15($activeSubTab$delegate), "BILLING") ? Color.INSTANCE.m5131getWhite0d7_KjU() : ColorKt.getTextSecondary(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            if (BillingScreen$lambda$4($cart$delegate).isEmpty()) {
                $composer.startReplaceGroup(-1778245597);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1779257530);
                ComposerKt.sourceInformation($composer, "335@17471L28,340@17814L622,336@17544L892");
                SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(6)), $composer, 6);
                SurfaceKt.m2926SurfaceT9BRK9s(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(16)), RoundedCornerShapeKt.getCircleShape(), ColorKt.getSaSGreen(), 0L, 0.0f, 0.0f, null, ComposableLambdaKt.rememberComposableLambda(-1495913515, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda25
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$48$0$4$0$3$0$0;
                        BillingScreen$lambda$48$0$4$0$3$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$0$3$0$0(State.this, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$48$0$4$0$3$0$0;
                    }
                }, $composer, 54), $composer, 12582918, MenuKt.InTransitionDuration);
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
    public static final Unit BillingScreen$lambda$48$0$4$0$3$0$0(State $cart$delegate, Composer $composer, int $changed) {
        Function0 function0;
        ComposerKt.sourceInformation($composer, "C341@17864L526:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1495913515, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:341)");
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
            ComposerKt.sourceInformationMarkerStart($composer, -910264073, "C342@17959L381:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk(String.valueOf(CollectionsKt.sumOfInt(BillingScreen$lambda$4($cart$delegate).values())), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
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
    public static final Unit BillingScreen$lambda$48$0$4$1$0$0$0(BillingViewModel $billingViewModel, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $billingViewModel.setSearchQuery(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$1$1$0(final BillingViewModel $billingViewModel, final State $selectedCategory$delegate, State $categories$delegate, LazyListScope LazyRow) {
        Intrinsics.checkNotNullParameter(LazyRow, "$this$LazyRow");
        LazyListScope.item$default(LazyRow, null, null, ComposableLambdaKt.composableLambdaInstance(1856655938, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda3
            @Override // kotlin.jvm.functions.Function3
            public final Object invoke(Object obj, Object obj2, Object obj3) {
                Unit BillingScreen$lambda$48$0$4$1$1$0$0;
                BillingScreen$lambda$48$0$4$1$1$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$1$1$0$0(BillingViewModel.this, $selectedCategory$delegate, (LazyItemScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                return BillingScreen$lambda$48$0$4$1$1$0$0;
            }
        }), 3, null);
        final List BillingScreen$lambda$1 = BillingScreen$lambda$1($categories$delegate);
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$1$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((CategoryItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(CategoryItem categoryItem) {
                return null;
            }
        };
        LazyRow.items(BillingScreen$lambda$1.size(), null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$1$0$$inlined$items$default$3
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object] */
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke(BillingScreen$lambda$1.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(802480018, true, new Function4<LazyItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$1$0$$inlined$items$default$4
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object, java.lang.Object, java.lang.Object, java.lang.Object] */
            /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyItemScope lazyItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyItemScope $this$items, int it, Composer $composer, int $changed) {
                String BillingScreen$lambda$2;
                String BillingScreen$lambda$22;
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
                final CategoryItem categoryItem = (CategoryItem) BillingScreen$lambda$1.get(it);
                $composer.startReplaceGroup(-1312639957);
                ComposerKt.sourceInformation($composer, "CN(cat)*417@22698L42,418@22794L78,419@22946L379,425@23399L373,415@22547L1267:BillingScreen.kt#7ez3px");
                BillingScreen$lambda$2 = BillingScreenKt.BillingScreen$lambda$2($selectedCategory$delegate);
                boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$2, categoryItem.getName());
                ComposerKt.sourceInformationMarkerStart($composer, 511849711, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance = $composer.changedInstance($billingViewModel) | ((((i & 112) ^ 48) > 32 && $composer.changed(categoryItem)) || (i & 48) == 32);
                Object rememberedValue = $composer.rememberedValue();
                if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                    final BillingViewModel billingViewModel = $billingViewModel;
                    Object obj = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$4$1$5$2$2$1$2$1$1
                        /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
                        @Override // kotlin.jvm.functions.Function0
                        public /* bridge */ /* synthetic */ Unit invoke() {
                            invoke2();
                            return Unit.INSTANCE;
                        }

                        /* JADX DEBUG: Possible override for method kotlin.jvm.functions.Function0.invoke()Ljava/lang/Object; */
                        /* renamed from: invoke, reason: avoid collision after fix types in other method */
                        public final void invoke2() {
                            BillingViewModel.this.setCategory(categoryItem.getName());
                        }
                    };
                    $composer.updateRememberedValue(obj);
                    rememberedValue = obj;
                }
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposableLambda rememberComposableLambda = ComposableLambdaKt.rememberComposableLambda(-1272317134, true, new Function2<Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$4$1$5$2$2$1$2$2
                    /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object, java.lang.Object] */
                    /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
                    @Override // kotlin.jvm.functions.Function2
                    public /* bridge */ /* synthetic */ Unit invoke(Composer composer, Integer num) {
                        invoke(composer, num.intValue());
                        return Unit.INSTANCE;
                    }

                    public final void invoke(Composer $composer2, int $changed2) {
                        ComposerKt.sourceInformation($composer2, "C418@22796L74:BillingScreen.kt#7ez3px");
                        if (!$composer2.shouldExecute(($changed2 & 3) != 2, $changed2 & 1)) {
                            $composer2.skipToGroupEnd();
                            return;
                        }
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventStart(-1272317134, $changed2, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:418)");
                        }
                        String upperCase = CategoryItem.this.getName().toUpperCase(Locale.ROOT);
                        Intrinsics.checkNotNullExpressionValue(upperCase, "toUpperCase(...)");
                        TextKt.m3069TextNvy7gAk(upperCase, null, 0L, null, TextUnitKt.getSp(11), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, 1597440, 0, 262062);
                        if (ComposerKt.isTraceInProgress()) {
                            ComposerKt.traceEventEnd();
                        }
                    }
                }, $composer, 54);
                SelectableChipColors m2456filterChipColorsXqyqHi0 = FilterChipDefaults.INSTANCE.m2456filterChipColorsXqyqHi0(ColorKt.getInputDark(), ColorKt.getTextSecondary(), 0L, 0L, 0L, 0L, 0L, ColorKt.getSaSGreen(), 0L, Color.INSTANCE.m5131getWhite0d7_KjU(), 0L, 0L, $composer, 805306368, FilterChipDefaults.$stable << 6, 3452);
                FilterChipDefaults filterChipDefaults = FilterChipDefaults.INSTANCE;
                BillingScreen$lambda$22 = BillingScreenKt.BillingScreen$lambda$2($selectedCategory$delegate);
                ChipKt.FilterChip(areEqual, (Function0) rememberedValue, rememberComposableLambda, null, false, null, null, null, m2456filterChipColorsXqyqHi0, null, filterChipDefaults.m2455filterChipBorder_7El2pE(true, Intrinsics.areEqual(BillingScreen$lambda$22, categoryItem.getName()), ColorKt.getCardBorderDark(), ColorKt.getSaSGreen(), 0L, 0L, 0.0f, 0.0f, $composer, (FilterChipDefaults.$stable << 24) | 6, 240), null, $composer, 384, 0, 2808);
                $composer.endReplaceGroup();
                if (ComposerKt.isTraceInProgress()) {
                    ComposerKt.traceEventEnd();
                }
            }
        }));
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$1$1$0$0(final BillingViewModel $billingViewModel, State $selectedCategory$delegate, LazyItemScope item, Composer $composer, int $changed) {
        Intrinsics.checkNotNullParameter(item, "$this$item");
        ComposerKt.sourceInformation($composer, "C398@21310L39,400@21540L379,406@21993L370,396@21162L1243:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1856655938, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:396)");
            }
            boolean areEqual = Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL");
            ComposerKt.sourceInformationMarkerStart($composer, 1834934697, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changedInstance = $composer.changedInstance($billingViewModel);
            Object rememberedValue = $composer.rememberedValue();
            if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda14
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$48$0$4$1$1$0$0$0$0;
                        BillingScreen$lambda$48$0$4$1$1$0$0$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$1$1$0$0$0$0(BillingViewModel.this);
                        return BillingScreen$lambda$48$0$4$1$1$0$0$0$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ChipKt.FilterChip(areEqual, (Function0) rememberedValue, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$790207221$app(), null, false, null, null, null, FilterChipDefaults.INSTANCE.m2456filterChipColorsXqyqHi0(ColorKt.getInputDark(), ColorKt.getTextSecondary(), 0L, 0L, 0L, 0L, 0L, ColorKt.getSaSGreen(), 0L, Color.INSTANCE.m5131getWhite0d7_KjU(), 0L, 0L, $composer, 805306368, FilterChipDefaults.$stable << 6, 3452), null, FilterChipDefaults.INSTANCE.m2455filterChipBorder_7El2pE(true, Intrinsics.areEqual(BillingScreen$lambda$2($selectedCategory$delegate), "ALL"), ColorKt.getCardBorderDark(), ColorKt.getSaSGreen(), 0L, 0L, 0.0f, 0.0f, $composer, (FilterChipDefaults.$stable << 24) | 6, 240), null, $composer, 384, 0, 2808);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$1$1$0$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.setCategory("ALL");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$1$3$0$0$0(BillingViewModel $billingViewModel) {
        $billingViewModel.loadCatalogAndCategories();
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$1$5$0(final List $filteredItems, final BillingViewModel $billingViewModel, final State $cart$delegate, final State $oldKotItems$delegate, LazyGridScope LazyVerticalGrid) {
        Intrinsics.checkNotNullParameter(LazyVerticalGrid, "$this$LazyVerticalGrid");
        final Function1 function1 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda18
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Object BillingScreen$lambda$48$0$4$1$5$0$0;
                BillingScreen$lambda$48$0$4$1$5$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$1$5$0$0((MenuItem) obj);
                return BillingScreen$lambda$48$0$4$1$5$0$0;
            }
        };
        final Function1 function12 = new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$5$0$$inlined$items$default$1
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Object p1) {
                return invoke((MenuItem) p1);
            }

            @Override // kotlin.jvm.functions.Function1
            public final Void invoke(MenuItem menuItem) {
                return null;
            }
        };
        LazyVerticalGrid.items($filteredItems.size(), new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$5$0$$inlined$items$default$2
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object] */
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($filteredItems.get(index));
            }
        }, null, new Function1<Integer, Object>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$5$0$$inlined$items$default$4
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object] */
            @Override // kotlin.jvm.functions.Function1
            public /* bridge */ /* synthetic */ Object invoke(Integer num) {
                return invoke(num.intValue());
            }

            public final Object invoke(int index) {
                return Function1.this.invoke($filteredItems.get(index));
            }
        }, ComposableLambdaKt.composableLambdaInstance(-1117249557, true, new Function4<LazyGridItemScope, Integer, Composer, Integer, Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$lambda$48$0$4$1$5$0$$inlined$items$default$5
            /* JADX DEBUG: Method arguments types fixed to match base method, original types: [java.lang.Object, java.lang.Object, java.lang.Object, java.lang.Object] */
            /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
            @Override // kotlin.jvm.functions.Function4
            public /* bridge */ /* synthetic */ Unit invoke(LazyGridItemScope lazyGridItemScope, Integer num, Composer composer, Integer num2) {
                invoke(lazyGridItemScope, num.intValue(), composer, num2.intValue());
                return Unit.INSTANCE;
            }

            public final void invoke(LazyGridItemScope $this$items, int it, Composer $composer, int $changed) {
                Map BillingScreen$lambda$4;
                Map BillingScreen$lambda$5;
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
                    int i = $dirty & 14;
                    final MenuItem menuItem = (MenuItem) $filteredItems.get(it);
                    $composer.startReplaceGroup(1942496058);
                    ComposerKt.sourceInformation($composer, "CN(item)*475@26764L36,476@26861L41,471@26489L459:BillingScreen.kt#7ez3px");
                    BillingScreen$lambda$4 = BillingScreenKt.BillingScreen$lambda$4($cart$delegate);
                    Integer num = (Integer) BillingScreen$lambda$4.get(menuItem);
                    int intValue = num != null ? num.intValue() : 0;
                    BillingScreen$lambda$5 = BillingScreenKt.BillingScreen$lambda$5($oldKotItems$delegate);
                    Integer num2 = (Integer) BillingScreen$lambda$5.get(menuItem);
                    int intValue2 = num2 != null ? num2.intValue() : 0;
                    ComposerKt.sourceInformationMarkerStart($composer, 2140884513, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance = ((((i & 112) ^ 48) > 32 && $composer.changed(menuItem)) || (i & 48) == 32) | $composer.changedInstance($billingViewModel);
                    Object rememberedValue = $composer.rememberedValue();
                    if (changedInstance || rememberedValue == Composer.INSTANCE.getEmpty()) {
                        final BillingViewModel billingViewModel = $billingViewModel;
                        Object obj = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$4$1$5$2$6$1$2$1$1
                            /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
                            @Override // kotlin.jvm.functions.Function0
                            public /* bridge */ /* synthetic */ Unit invoke() {
                                invoke2();
                                return Unit.INSTANCE;
                            }

                            /* JADX DEBUG: Possible override for method kotlin.jvm.functions.Function0.invoke()Ljava/lang/Object; */
                            /* renamed from: invoke, reason: avoid collision after fix types in other method */
                            public final void invoke2() {
                                BillingViewModel.this.addToCart(menuItem);
                            }
                        };
                        $composer.updateRememberedValue(obj);
                        rememberedValue = obj;
                    }
                    Function0 function0 = (Function0) rememberedValue;
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    ComposerKt.sourceInformationMarkerStart($composer, 2140887622, "CC(remember):BillingScreen.kt#9igjgp");
                    boolean changedInstance2 = $composer.changedInstance($billingViewModel) | ((((i & 112) ^ 48) > 32 && $composer.changed(menuItem)) || (i & 48) == 32);
                    Object rememberedValue2 = $composer.rememberedValue();
                    if (changedInstance2 || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                        final BillingViewModel billingViewModel2 = $billingViewModel;
                        Object obj2 = (Function0) new Function0<Unit>() { // from class: com.example.sasloopmanager.BillingScreenKt$BillingScreen$4$1$5$2$6$1$2$2$1
                            /* JADX DEBUG: Return type fixed from 'java.lang.Object' to match base method */
                            @Override // kotlin.jvm.functions.Function0
                            public /* bridge */ /* synthetic */ Unit invoke() {
                                invoke2();
                                return Unit.INSTANCE;
                            }

                            /* JADX DEBUG: Possible override for method kotlin.jvm.functions.Function0.invoke()Ljava/lang/Object; */
                            /* renamed from: invoke, reason: avoid collision after fix types in other method */
                            public final void invoke2() {
                                BillingViewModel.this.removeFromCart(menuItem);
                            }
                        };
                        $composer.updateRememberedValue(obj2);
                        rememberedValue2 = obj2;
                    }
                    ComposerKt.sourceInformationMarkerEnd($composer);
                    BillingScreenKt.MenuItemCard(menuItem, intValue, intValue2, function0, (Function0) rememberedValue2, $composer, (i >> 3) & 14);
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
    public static final Object BillingScreen$lambda$48$0$4$1$5$0$0(MenuItem it) {
        Intrinsics.checkNotNullParameter(it, "it");
        return Integer.valueOf(it.getId());
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$3$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("BILLING");
        return Unit.INSTANCE;
    }

    /* JADX DEBUG: Don't trust debug lines info. Repeating lines: [531=4] */
    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$4(final MutableState $activeSubTab$delegate, int $totalItems, double $totalPrice, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        long m5092copywmQWz5c;
        Function0 function03;
        Function0 function04;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C498@28081L2835:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1381145432, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:498)");
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
            ComposerKt.sourceInformationMarkerStart($composer, 1371605645, "C505@28524L1486,528@30211L39,527@30113L28,526@30051L827:BillingScreen.kt#7ez3px");
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
            ComposerKt.sourceInformationMarkerStart($composer, -271163039, "C506@28622L618,515@29285L40,516@29370L598:BillingScreen.kt#7ez3px");
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
            ComposerKt.sourceInformationMarkerStart($composer, 1514343569, "C513@29106L88:BillingScreen.kt#7ez3px");
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
            ComposerKt.sourceInformationMarkerStart($composer, -483810742, "C517@29427L75,518@29551L371:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk($totalItems + " items selected", null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
            StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
            String format = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($totalPrice)}, 1));
            Intrinsics.checkNotNullExpressionValue(format, "format(...)");
            TextKt.m3069TextNvy7gAk("₹ " + format, null, ColorKt.getSaSGreen(), null, TextUnitKt.getSp(16), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
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
            RoundedCornerShape m1124RoundedCornerShape0680j_4 = RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(8));
            PaddingValues m810PaddingValuesYgX7TsA = PaddingKt.m810PaddingValuesYgX7TsA(Dp.m7902constructorimpl(14), Dp.m7902constructorimpl(6));
            ComposerKt.sourceInformationMarkerStart($composer, -1341179456, "CC(remember):BillingScreen.kt#9igjgp");
            boolean changed = $composer.changed($activeSubTab$delegate);
            Object rememberedValue = $composer.rememberedValue();
            if (changed || rememberedValue == Composer.INSTANCE.getEmpty()) {
                Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda26
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$48$0$4$4$0$1$0;
                        BillingScreen$lambda$48$0$4$4$0$1$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$4$0$1$0(MutableState.this);
                        return BillingScreen$lambda$48$0$4$4$0$1$0;
                    }
                };
                $composer.updateRememberedValue(obj);
                rememberedValue = obj;
            }
            ComposerKt.sourceInformationMarkerEnd($composer);
            ButtonKt.Button((Function0) rememberedValue, null, false, m1124RoundedCornerShape0680j_4, m2121buttonColorsro_MJ88, null, null, m810PaddingValuesYgX7TsA, null, ComposableSingletons$BillingScreenKt.INSTANCE.m8432getLambda$79490860$app(), $composer, 817889280, 358);
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
    public static final Unit BillingScreen$lambda$48$0$4$4$0$1$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("BILLING");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$5$0$0$0(MutableState $activeSubTab$delegate) {
        $activeSubTab$delegate.setValue("MENU");
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Code restructure failed: missing block: B:63:0x085f, code lost:
    
        if (r3 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L82;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public static final Unit BillingScreen$lambda$48$0$4$6$0(State $cart$delegate, State $oldKotItems$delegate, final BillingViewModel $billingViewModel, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Function0 function03;
        Function0 function04;
        Function0 function05;
        long m5092copywmQWz5c;
        long m5092copywmQWz5c2;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C580@33564L4974:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-349710112, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:580)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(10));
            Arrangement.Vertical m686spacedBy0680j_4 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
            int i = 54;
            Composer composer = $composer;
            int i2 = 0;
            String str = "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo";
            ComposerKt.sourceInformationMarkerStart(composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            Alignment.Horizontal start = Alignment.INSTANCE.getStart();
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(m686spacedBy0680j_4, start, composer, ((54 >> 3) & 14) | ((54 >> 3) & 112));
            String str2 = "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh";
            ComposerKt.sourceInformationMarkerStart(composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer, 0));
            CompositionLocalMap currentCompositionLocalMap = composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier(composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i3 = ((((54 << 3) & 112) << 6) & 896) | 6;
            int i4 = 6;
            String str3 = "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp";
            ComposerKt.sourceInformationMarkerStart(composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!(composer.getApplier() instanceof Applier)) {
                ComposablesKt.invalidApplier();
            }
            composer.startReusableNode();
            if (composer.getInserting()) {
                function0 = constructor;
                composer.createNode(function0);
            } else {
                function0 = constructor;
                composer.useNode();
            }
            Composer m4364constructorimpl = Updater.m4364constructorimpl(composer);
            MeasurePolicy measurePolicy = columnMeasurePolicy;
            Updater.m4372setimpl(m4364constructorimpl, measurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl, currentCompositionLocalMap, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl, Integer.valueOf(hashCode), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl, materializeModifier, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i3 >> 6) & 14;
            String str4 = "C89@4557L9:Column.kt#2w3rfo";
            ComposerKt.sourceInformationMarkerStart(composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i6 = ((54 >> 6) & 112) | 6;
            Composer composer2 = composer;
            ComposerKt.sourceInformationMarkerStart(composer2, 468804416, "C:BillingScreen.kt#7ez3px");
            composer2.startReplaceGroup(15123126);
            ComposerKt.sourceInformation(composer2, "*586@34036L4414");
            Iterable<Map.Entry> entrySet = BillingScreen$lambda$4($cart$delegate).entrySet();
            int i7 = 0;
            for (Map.Entry entry : entrySet) {
                Iterable iterable = entrySet;
                final MenuItem menuItem = (MenuItem) entry.getKey();
                int i8 = i7;
                final int intValue = ((Number) entry.getValue()).intValue();
                Composer composer3 = composer2;
                Integer num = BillingScreen$lambda$5($oldKotItems$delegate).get(menuItem);
                final int intValue2 = num != null ? num.intValue() : 0;
                boolean z = intValue2 > 0;
                boolean z2 = intValue > intValue2;
                MeasurePolicy measurePolicy2 = measurePolicy;
                int i9 = i;
                Composer composer4 = composer;
                int i10 = i2;
                Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
                Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
                int i11 = hashCode;
                ComposerKt.sourceInformationMarkerStart(composer3, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, composer3, ((438 >> 3) & 14) | ((438 >> 3) & 112));
                ComposerKt.sourceInformationMarkerStart(composer3, -1159599143, str2);
                int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer3, 0));
                CompositionLocalMap currentCompositionLocalMap2 = composer3.getCurrentCompositionLocalMap();
                Modifier materializeModifier2 = ComposedModifierKt.materializeModifier(composer3, fillMaxWidth$default);
                Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
                int i12 = ((((438 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart(composer3, -553112988, str3);
                if (!(composer3.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                composer3.startReusableNode();
                if (composer3.getInserting()) {
                    function02 = constructor2;
                    composer3.createNode(function02);
                } else {
                    function02 = constructor2;
                    composer3.useNode();
                }
                Composer m4364constructorimpl2 = Updater.m4364constructorimpl(composer3);
                Alignment.Horizontal horizontal = start;
                Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
                int i13 = (i12 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart(composer3, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                int i14 = ((438 >> 6) & 112) | 6;
                RowScope rowScope = RowScopeInstance.INSTANCE;
                ComposerKt.sourceInformationMarkerStart(composer3, 505195930, "C591@34434L1865,611@36443L1957:BillingScreen.kt#7ez3px");
                Modifier weight$default = RowScope.weight$default(rowScope, Modifier.INSTANCE, 1.0f, false, 2, null);
                ComposerKt.sourceInformationMarkerStart(composer3, 1341605231, str);
                String str5 = str;
                MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), composer3, ((0 >> 3) & 14) | ((0 >> 3) & 112));
                ComposerKt.sourceInformationMarkerStart(composer3, -1159599143, str2);
                int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer3, 0));
                CompositionLocalMap currentCompositionLocalMap3 = composer3.getCurrentCompositionLocalMap();
                Modifier materializeModifier3 = ComposedModifierKt.materializeModifier(composer3, weight$default);
                Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
                int i15 = ((((0 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart(composer3, -553112988, str3);
                if (!(composer3.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                composer3.startReusableNode();
                if (composer3.getInserting()) {
                    function03 = constructor3;
                    composer3.createNode(function03);
                } else {
                    function03 = constructor3;
                    composer3.useNode();
                }
                Composer m4364constructorimpl3 = Updater.m4364constructorimpl(composer3);
                Updater.m4372setimpl(m4364constructorimpl3, columnMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
                int i16 = (i15 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart(composer3, 2093002350, str4);
                ColumnScopeInstance columnScopeInstance2 = ColumnScopeInstance.INSTANCE;
                int i17 = ((0 >> 6) & 112) | 6;
                String str6 = str4;
                ComposerKt.sourceInformationMarkerStart(composer3, -872934948, "C592@34531L91,593@34679L1566:BillingScreen.kt#7ez3px");
                TextKt.m3069TextNvy7gAk(menuItem.getProductName(), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer3, 1597824, 0, 262058);
                Alignment.Vertical centerVertically2 = Alignment.INSTANCE.getCenterVertically();
                ComposerKt.sourceInformationMarkerStart(composer3, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                Modifier modifier = Modifier.INSTANCE;
                MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(Arrangement.INSTANCE.getStart(), centerVertically2, composer3, ((384 >> 3) & 14) | ((384 >> 3) & 112));
                ComposerKt.sourceInformationMarkerStart(composer3, -1159599143, str2);
                int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer3, 0));
                CompositionLocalMap currentCompositionLocalMap4 = composer3.getCurrentCompositionLocalMap();
                Modifier materializeModifier4 = ComposedModifierKt.materializeModifier(composer3, modifier);
                Function0 constructor4 = ComposeUiNode.INSTANCE.getConstructor();
                int i18 = ((((384 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart(composer3, -553112988, str3);
                if (!(composer3.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                composer3.startReusableNode();
                if (composer3.getInserting()) {
                    function04 = constructor4;
                    composer3.createNode(function04);
                } else {
                    function04 = constructor4;
                    composer3.useNode();
                }
                Composer m4364constructorimpl4 = Updater.m4364constructorimpl(composer3);
                Updater.m4372setimpl(m4364constructorimpl4, rowMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl4, currentCompositionLocalMap4, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl4, Integer.valueOf(hashCode4), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl4, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl4, materializeModifier4, ComposeUiNode.INSTANCE.getSetModifier());
                int i19 = (i18 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart(composer3, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
                int i20 = ((384 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart(composer3, 230211840, "C594@34793L94:BillingScreen.kt#7ez3px");
                StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                String format = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf(menuItem.getPrice())}, 1));
                Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                TextKt.m3069TextNvy7gAk("₹ " + format + " x " + intValue, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer3, 24576, 0, 262122);
                if (z) {
                    composer3.startReplaceGroup(230355090);
                    ComposerKt.sourceInformation(composer3, "596@35029L28,597@35207L269,597@35122L354");
                    SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(6)), composer3, i4);
                    m5092copywmQWz5c2 = Color.m5092copywmQWz5c(r131, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r131) : 0.15f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r131) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r131) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getStatusSuccess()) : 0.0f);
                    SurfaceKt.m2926SurfaceT9BRK9s(null, RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(4)), m5092copywmQWz5c2, 0L, 0.0f, 0.0f, null, ComposableLambdaKt.rememberComposableLambda(-930285189, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda4
                        @Override // kotlin.jvm.functions.Function2
                        public final Object invoke(Object obj, Object obj2) {
                            Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$0;
                            BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$0(intValue2, (Composer) obj, ((Integer) obj2).intValue());
                            return BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$0;
                        }
                    }, composer3, 54), composer3, 12582912, 121);
                    composer3.endReplaceGroup();
                } else {
                    composer3.startReplaceGroup(230907665);
                    composer3.endReplaceGroup();
                }
                if (z2) {
                    composer3.startReplaceGroup(230998898);
                    ComposerKt.sourceInformation(composer3, "602@35678L28,603@35853L272,603@35771L354");
                    SpacerKt.Spacer(SizeKt.m867width3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(6)), composer3, 6);
                    m5092copywmQWz5c = Color.m5092copywmQWz5c(r131, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r131) : 0.15f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r131) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r131) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getStatusInfo()) : 0.0f);
                    SurfaceKt.m2926SurfaceT9BRK9s(null, RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(4)), m5092copywmQWz5c, 0L, 0.0f, 0.0f, null, ComposableLambdaKt.rememberComposableLambda(-1446434460, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda5
                        @Override // kotlin.jvm.functions.Function2
                        public final Object invoke(Object obj, Object obj2) {
                            Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$1;
                            BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$1 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$1(intValue, intValue2, (Composer) obj, ((Integer) obj2).intValue());
                            return BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$1;
                        }
                    }, composer3, 54), composer3, 12582912, 121);
                    composer3.endReplaceGroup();
                } else {
                    composer3.startReplaceGroup(231551473);
                    composer3.endReplaceGroup();
                }
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                composer3.endNode();
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                composer3.endNode();
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                Alignment.Vertical centerVertically3 = Alignment.INSTANCE.getCenterVertically();
                Arrangement.Horizontal m686spacedBy0680j_42 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
                ComposerKt.sourceInformationMarkerStart(composer3, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                Modifier modifier2 = Modifier.INSTANCE;
                MeasurePolicy rowMeasurePolicy3 = RowKt.rowMeasurePolicy(m686spacedBy0680j_42, centerVertically3, composer3, ((432 >> 3) & 14) | ((432 >> 3) & 112));
                ComposerKt.sourceInformationMarkerStart(composer3, -1159599143, str2);
                int hashCode5 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode(composer3, 0));
                CompositionLocalMap currentCompositionLocalMap5 = composer3.getCurrentCompositionLocalMap();
                String str7 = str2;
                Modifier materializeModifier5 = ComposedModifierKt.materializeModifier(composer3, modifier2);
                Function0 constructor5 = ComposeUiNode.INSTANCE.getConstructor();
                int i21 = ((((432 << 3) & 112) << 6) & 896) | 6;
                ComposerKt.sourceInformationMarkerStart(composer3, -553112988, str3);
                if (!(composer3.getApplier() instanceof Applier)) {
                    ComposablesKt.invalidApplier();
                }
                composer3.startReusableNode();
                if (composer3.getInserting()) {
                    function05 = constructor5;
                    composer3.createNode(function05);
                } else {
                    function05 = constructor5;
                    composer3.useNode();
                }
                Composer m4364constructorimpl5 = Updater.m4364constructorimpl(composer3);
                String str8 = str3;
                Updater.m4372setimpl(m4364constructorimpl5, rowMeasurePolicy3, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl5, currentCompositionLocalMap5, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl5, Integer.valueOf(hashCode5), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl5, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl5, materializeModifier5, ComposeUiNode.INSTANCE.getSetModifier());
                int i22 = (i21 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart(composer3, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                RowScopeInstance rowScopeInstance2 = RowScopeInstance.INSTANCE;
                i4 = 6;
                int i23 = ((432 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart(composer3, -154722289, "C613@36687L63,616@37070L575,612@36605L1040,623@37702L81,625@37922L36,624@37840L506:BillingScreen.kt#7ez3px");
                boolean z3 = intValue > intValue2;
                Modifier m261backgroundbw27NRU = BackgroundKt.m261backgroundbw27NRU(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(24)), intValue > intValue2 ? ColorKt.getInputDark() : Color.INSTANCE.m5129getTransparent0d7_KjU(), RoundedCornerShapeKt.getCircleShape());
                ComposerKt.sourceInformationMarkerStart(composer3, 1796125222, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changed = composer3.changed(intValue) | composer3.changed(intValue2) | composer3.changedInstance($billingViewModel) | composer3.changed(menuItem);
                Object rememberedValue = composer3.rememberedValue();
                if (changed) {
                }
                rememberedValue = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda6
                    @Override // kotlin.jvm.functions.Function0
                    public final Object invoke() {
                        Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$1$0$0;
                        BillingScreen$lambda$48$0$4$6$0$0$0$0$1$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$0$0$0$0$1$0$0(intValue, intValue2, $billingViewModel, menuItem);
                        return BillingScreen$lambda$48$0$4$6$0$0$0$0$1$0$0;
                    }
                };
                composer3.updateRememberedValue(rememberedValue);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                IconButtonKt.IconButton((Function0) rememberedValue, m261backgroundbw27NRU, z3, null, null, null, ComposableLambdaKt.rememberComposableLambda(934497097, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda7
                    @Override // kotlin.jvm.functions.Function2
                    public final Object invoke(Object obj, Object obj2) {
                        Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$1$1;
                        BillingScreen$lambda$48$0$4$6$0$0$0$0$1$1 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$0$0$0$0$1$1(intValue, intValue2, (Composer) obj, ((Integer) obj2).intValue());
                        return BillingScreen$lambda$48$0$4$6$0$0$0$0$1$1;
                    }
                }, composer3, 54), composer3, 1572864, 56);
                TextKt.m3069TextNvy7gAk(String.valueOf(intValue), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer3, 1597824, 0, 262058);
                ComposerKt.sourceInformationMarkerStart(composer3, 1796164715, "CC(remember):BillingScreen.kt#9igjgp");
                boolean changedInstance = composer3.changedInstance($billingViewModel) | composer3.changed(menuItem);
                Object rememberedValue2 = composer3.rememberedValue();
                if (changedInstance || rememberedValue2 == Composer.INSTANCE.getEmpty()) {
                    Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda8
                        @Override // kotlin.jvm.functions.Function0
                        public final Object invoke() {
                            Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$1$2$0;
                            BillingScreen$lambda$48$0$4$6$0$0$0$0$1$2$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$0$0$0$0$1$2$0(BillingViewModel.this, menuItem);
                            return BillingScreen$lambda$48$0$4$6$0$0$0$0$1$2$0;
                        }
                    };
                    composer3.updateRememberedValue(obj);
                    rememberedValue2 = obj;
                }
                ComposerKt.sourceInformationMarkerEnd(composer3);
                IconButtonKt.IconButton((Function0) rememberedValue2, BackgroundKt.m261backgroundbw27NRU(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(24)), ColorKt.getSaSGreen(), RoundedCornerShapeKt.getCircleShape()), false, null, null, null, ComposableSingletons$BillingScreenKt.INSTANCE.m8423getLambda$1107048526$app(), composer3, 1572864, 60);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                composer3.endNode();
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                composer3.endNode();
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                ComposerKt.sourceInformationMarkerEnd(composer3);
                composer2 = composer3;
                i7 = i8;
                entrySet = iterable;
                i = i9;
                measurePolicy = measurePolicy2;
                composer = composer4;
                i2 = i10;
                hashCode = i11;
                start = horizontal;
                str = str5;
                str2 = str7;
                str3 = str8;
                str4 = str6;
            }
            Composer composer5 = composer2;
            composer5.endReplaceGroup();
            ComposerKt.sourceInformationMarkerEnd(composer5);
            ComposerKt.sourceInformationMarkerEnd(composer);
            composer.endNode();
            ComposerKt.sourceInformationMarkerEnd(composer);
            ComposerKt.sourceInformationMarkerEnd(composer);
            ComposerKt.sourceInformationMarkerEnd(composer);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$0(int $punchedQty, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C598@35277L133:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-930285189, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:598)");
            }
            TextKt.m3069TextNvy7gAk("Punched: " + $punchedQty, PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(4), Dp.m7902constructorimpl(1)), ColorKt.getStatusSuccess(), null, TextUnitKt.getSp(8), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24624, 0, 262120);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$0$0$1(int $qty, int $punchedQty, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C604@35923L136:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1446434460, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:604)");
            }
            TextKt.m3069TextNvy7gAk("Draft: " + ($qty - $punchedQty), PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(4), Dp.m7902constructorimpl(1)), ColorKt.getStatusInfo(), null, TextUnitKt.getSp(8), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24624, 0, 262120);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$1$0$0(int $qty, int $punchedQty, BillingViewModel $billingViewModel, MenuItem $item) {
        if ($qty > $punchedQty) {
            $billingViewModel.removeFromCart($item);
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$1$1(int $qty, int $punchedQty, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(934497097, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:617)");
            }
            if ($qty == $punchedQty) {
                $composer.startReplaceGroup(-374843516);
                ComposerKt.sourceInformation($composer, "618@37221L85");
                IconKt.m2517Iconww6aTOc(LockKt.getLock(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(10)), ColorKt.getTextSecondary(), $composer, 432, 0);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-374626268);
                ComposerKt.sourceInformation($composer, "620@37440L85");
                IconKt.m2517Iconww6aTOc(RemoveKt.getRemove(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), Color.INSTANCE.m5131getWhite0d7_KjU(), $composer, 3504, 0);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$0$0$0$0$1$2$0(BillingViewModel $billingViewModel, MenuItem $item) {
        $billingViewModel.addToCart($item);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$1$0$0(MutableState $customerName$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerName$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$1$1$0(MutableState $customerPhone$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $customerPhone$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$2$0$0$0(String $type, MutableState $orderType$delegate) {
        $orderType$delegate.setValue($type);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$3$0$0$0(String $method, MutableState $paymentMethod$delegate) {
        $paymentMethod$delegate.setValue($method);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$4$0$0(MutableState $discountInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $discountInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$4$1$0(MutableState $serviceChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $serviceChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$5$0(MutableState $deliveryChargeInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $deliveryChargeInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$6$0(MutableState $preOrderIdInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $preOrderIdInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$7$0(MutableState $advancePaidInput$delegate, String it) {
        Intrinsics.checkNotNullParameter(it, "it");
        $advancePaidInput$delegate.setValue(it);
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$9(double $subtotal, double $discount, double $taxableAmount, double $cgst, double $sgst, double $serviceCharge, double $deliveryCharge, double $finalTotal, double $advancePaid, double $remainingBalance, MutableState $orderType$delegate, State $activeFlow$delegate, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Composer composer;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C877@55966L3112:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-875550647, $changed, -1, "com.example.sasloopmanager.BillingScreen.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:877)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(14));
            Arrangement.Vertical m686spacedBy0680j_4 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(6));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(m686spacedBy0680j_4, Alignment.INSTANCE.getStart(), $composer, ((54 >> 3) & 14) | ((54 >> 3) & 112));
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
            ComposerKt.sourceInformationMarkerStart($composer, -1001719681, "C881@56235L94,883@56375L62,890@56961L61,891@57067L61,899@57686L87,901@57819L420:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk("RECEIPT SUMMARY", null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(10), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597446, 0, 262058);
            StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
            String format = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($subtotal)}, 1));
            Intrinsics.checkNotNullExpressionValue(format, "format(...)");
            m8420ReceiptRow6jMSoI("Subtotal", "₹ " + format, false, 0L, 0L, $composer, 6, 28);
            Composer composer2 = $composer;
            if ($discount > 0.0d) {
                composer2.startReplaceGroup(-1001537929);
                ComposerKt.sourceInformation(composer2, "885@56550L88");
                StringCompanionObject stringCompanionObject2 = StringCompanionObject.INSTANCE;
                String format2 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($discount)}, 1));
                Intrinsics.checkNotNullExpressionValue(format2, "format(...)");
                m8420ReceiptRow6jMSoI("Discount (-)", "₹ " + format2, false, ColorKt.getStatusDanger(), 0L, composer2, 6, 20);
                composer2 = composer2;
                composer2.endReplaceGroup();
            } else {
                composer2.startReplaceGroup(-1001361105);
                composer2.endReplaceGroup();
            }
            if ($discount > 0.0d) {
                composer2.startReplaceGroup(-1001293370);
                ComposerKt.sourceInformation(composer2, "888@56797L73");
                StringCompanionObject stringCompanionObject3 = StringCompanionObject.INSTANCE;
                Composer composer3 = composer2;
                String format3 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($taxableAmount)}, 1));
                Intrinsics.checkNotNullExpressionValue(format3, "format(...)");
                m8420ReceiptRow6jMSoI("Taxable Amount", "₹ " + format3, false, 0L, 0L, composer3, 6, 28);
                composer2 = composer3;
                composer2.endReplaceGroup();
            } else {
                composer2.startReplaceGroup(-1001130961);
                composer2.endReplaceGroup();
            }
            StringCompanionObject stringCompanionObject4 = StringCompanionObject.INSTANCE;
            Composer composer4 = composer2;
            String format4 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($cgst)}, 1));
            Intrinsics.checkNotNullExpressionValue(format4, "format(...)");
            m8420ReceiptRow6jMSoI("CGST (2.5%)", "₹ " + format4, false, 0L, 0L, composer4, 6, 28);
            StringCompanionObject stringCompanionObject5 = StringCompanionObject.INSTANCE;
            String format5 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($sgst)}, 1));
            Intrinsics.checkNotNullExpressionValue(format5, "format(...)");
            m8420ReceiptRow6jMSoI("SGST (2.5%)", "₹ " + format5, false, 0L, 0L, composer4, 6, 28);
            Composer composer5 = composer4;
            if ($serviceCharge > 0.0d) {
                composer5.startReplaceGroup(-1000847838);
                ComposerKt.sourceInformation(composer5, "893@57246L77");
                StringCompanionObject stringCompanionObject6 = StringCompanionObject.INSTANCE;
                String format6 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($serviceCharge)}, 1));
                Intrinsics.checkNotNullExpressionValue(format6, "format(...)");
                m8420ReceiptRow6jMSoI("Service Charge (+)", "₹ " + format6, false, 0L, 0L, composer5, 6, 28);
                composer5 = composer5;
                composer5.endReplaceGroup();
            } else {
                composer5.startReplaceGroup(-1000681585);
                composer5.endReplaceGroup();
            }
            if (Intrinsics.areEqual(BillingScreen$lambda$24($orderType$delegate), "DELIVERY") && $deliveryCharge > 0.0d) {
                composer5.startReplaceGroup(-1000580928);
                ComposerKt.sourceInformation(composer5, "896@57515L79");
                StringCompanionObject stringCompanionObject7 = StringCompanionObject.INSTANCE;
                String format7 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($deliveryCharge)}, 1));
                Intrinsics.checkNotNullExpressionValue(format7, "format(...)");
                m8420ReceiptRow6jMSoI("Delivery Charge (+)", "₹ " + format7, false, 0L, 0L, composer5, 6, 28);
                composer5.endReplaceGroup();
            } else {
                composer5.startReplaceGroup(-1000412753);
                composer5.endReplaceGroup();
            }
            Composer composer6 = composer5;
            DividerKt.m2396HorizontalDivider9IZ8Weo(PaddingKt.m818paddingVpY3zN4$default(Modifier.INSTANCE, 0.0f, Dp.m7902constructorimpl(4), 1, null), 0.0f, ColorKt.getCardBorderDark(), composer6, 6, 2);
            StringCompanionObject stringCompanionObject8 = StringCompanionObject.INSTANCE;
            String format8 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($finalTotal)}, 1));
            Intrinsics.checkNotNullExpressionValue(format8, "format(...)");
            m8420ReceiptRow6jMSoI("Grand Total", "₹ " + format8, true, ColorKt.getSaSGreen(), TextUnitKt.getSp(16), composer6, 24966, 0);
            if (Intrinsics.areEqual(BillingScreen$lambda$24($orderType$delegate), "PRE-ORDER") || Intrinsics.areEqual(BillingScreen$lambda$9($activeFlow$delegate), "PREORDER")) {
                composer6.startReplaceGroup(-999693894);
                ComposerKt.sourceInformation(composer6, "910@58393L93,911@58535L455");
                StringCompanionObject stringCompanionObject9 = StringCompanionObject.INSTANCE;
                String format9 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($advancePaid)}, 1));
                Intrinsics.checkNotNullExpressionValue(format9, "format(...)");
                composer = composer6;
                m8420ReceiptRow6jMSoI("Advance Paid (-)", "₹ " + format9, false, ColorKt.getStatusInfo(), 0L, composer, 6, 20);
                StringCompanionObject stringCompanionObject10 = StringCompanionObject.INSTANCE;
                String format10 = String.format("%.2f", Arrays.copyOf(new Object[]{Double.valueOf($remainingBalance)}, 1));
                Intrinsics.checkNotNullExpressionValue(format10, "format(...)");
                m8420ReceiptRow6jMSoI("Balance Due", "₹ " + format10, true, ColorKt.getStatusWarning(), TextUnitKt.getSp(16), composer, 24966, 0);
                composer.endReplaceGroup();
            } else {
                composer6.startReplaceGroup(-999027921);
                composer6.endReplaceGroup();
                composer = composer6;
            }
            ComposerKt.sourceInformationMarkerEnd(composer);
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
    public static final Unit BillingScreen$lambda$48$0$4$6$10$0$0(BillingViewModel $billingViewModel, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $orderType$delegate, final MutableState $activeSubTab$delegate) {
        $billingViewModel.saveKOT(BillingScreen$lambda$18($customerName$delegate), BillingScreen$lambda$21($customerPhone$delegate), BillingScreen$lambda$24($orderType$delegate), new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda9
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$48$0$4$6$10$0$0$0;
                BillingScreen$lambda$48$0$4$6$10$0$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$10$0$0$0(MutableState.this, ((Boolean) obj).booleanValue());
                return BillingScreen$lambda$48$0$4$6$10$0$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$10$0$0$0(MutableState $activeSubTab$delegate, boolean success) {
        if (success) {
            $activeSubTab$delegate.setValue("MENU");
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$10$1$0(BillingViewModel $billingViewModel, double $discount, double $serviceCharge, double $deliveryCharge, double $cgst, double $sgst, double $advancePaid, double $remainingBalance, MutableState $customerName$delegate, MutableState $customerPhone$delegate, MutableState $paymentMethod$delegate, MutableState $orderType$delegate, MutableState $preOrderIdInput$delegate) {
        $billingViewModel.settleOrder(BillingScreen$lambda$18($customerName$delegate), BillingScreen$lambda$21($customerPhone$delegate), BillingScreen$lambda$27($paymentMethod$delegate), BillingScreen$lambda$24($orderType$delegate), $discount, $serviceCharge, $deliveryCharge, $cgst, $sgst, Intrinsics.areEqual(BillingScreen$lambda$24($orderType$delegate), "PRE-ORDER") ? BillingScreen$lambda$39($preOrderIdInput$delegate) : null, Intrinsics.areEqual(BillingScreen$lambda$24($orderType$delegate), "PRE-ORDER") ? Double.valueOf($advancePaid) : null, Intrinsics.areEqual(BillingScreen$lambda$24($orderType$delegate), "PRE-ORDER") ? Double.valueOf($remainingBalance) : null, new Function1() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda19
            @Override // kotlin.jvm.functions.Function1
            public final Object invoke(Object obj) {
                Unit BillingScreen$lambda$48$0$4$6$10$1$0$0;
                BillingScreen$lambda$48$0$4$6$10$1$0$0 = BillingScreenKt.BillingScreen$lambda$48$0$4$6$10$1$0$0(((Boolean) obj).booleanValue());
                return BillingScreen$lambda$48$0$4$6$10$1$0$0;
            }
        });
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit BillingScreen$lambda$48$0$4$6$10$1$0$0(boolean success) {
        return Unit.INSTANCE;
    }

    /* renamed from: FlowCard-FHprtrg, reason: not valid java name */
    private static final void m8419FlowCardFHprtrg(Modifier modifier, final String title, final String subtext, final ImageVector icon, final long iconColor, final Function0<Unit> function0, Composer $composer, final int $changed, final int i) {
        Modifier modifier2;
        String str;
        String str2;
        ImageVector imageVector;
        Function0<Unit> function02;
        Composer $composer2;
        Modifier.Companion modifier3;
        Composer $composer3 = $composer.startRestartGroup(-589557774);
        ComposerKt.sourceInformation($composer3, "C(FlowCard)N(modifier,title,subtext,icon,iconColor:c#ui.graphics.Color,onClick)1007@64101L37,1009@64198L866,1002@63923L1141:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        int i2 = i & 1;
        if (i2 != 0) {
            $dirty |= 6;
            modifier2 = modifier;
        } else if (($changed & 6) == 0) {
            modifier2 = modifier;
            $dirty |= $composer3.changed(modifier2) ? 4 : 2;
        } else {
            modifier2 = modifier;
        }
        if (($changed & 48) == 0) {
            str = title;
            $dirty |= $composer3.changed(str) ? 32 : 16;
        } else {
            str = title;
        }
        if (($changed & 384) == 0) {
            str2 = subtext;
            $dirty |= $composer3.changed(str2) ? 256 : 128;
        } else {
            str2 = subtext;
        }
        if (($changed & 3072) == 0) {
            imageVector = icon;
            $dirty |= $composer3.changed(imageVector) ? 2048 : 1024;
        } else {
            imageVector = icon;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer3.changed(iconColor) ? 16384 : 8192;
        }
        if ((196608 & $changed) == 0) {
            function02 = function0;
            $dirty |= $composer3.changedInstance(function02) ? 131072 : 65536;
        } else {
            function02 = function0;
        }
        if (!$composer3.shouldExecute((74899 & $dirty) != 74898, $dirty & 1)) {
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
            modifier3 = modifier2;
        } else {
            if (i2 != 0) {
                modifier3 = Modifier.INSTANCE;
            } else {
                modifier3 = modifier2;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-589557774, $dirty, -1, "com.example.sasloopmanager.FlowCard (BillingScreen.kt:1001)");
            }
            final String str3 = str;
            final String str4 = str2;
            final ImageVector imageVector2 = imageVector;
            CardKt.Card(ClickableKt.m297clickableoSLSa3U$default(SizeKt.m848height3ABfNKs(modifier3, Dp.m7902constructorimpl(130)), false, null, null, null, function02, 15, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88(ColorKt.getCardDark(), 0L, 0L, 0L, $composer3, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), ColorKt.getCardBorderDark()), ComposableLambdaKt.rememberComposableLambda(1976965988, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda12
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.FlowCard_FHprtrg$lambda$0(iconColor, imageVector2, str3, str4, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer3, 54), $composer3, ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE, 8);
            $composer2 = $composer3;
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            final Modifier modifier4 = modifier3;
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda13
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.FlowCard_FHprtrg$lambda$1(Modifier.this, title, subtext, icon, iconColor, function0, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit FlowCard_FHprtrg$lambda$0(long $iconColor, ImageVector $icon, String $title, String $subtext, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        long m5092copywmQWz5c;
        Function0 function02;
        Function0 function03;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1010@64208L850:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1976965988, $changed, -1, "com.example.sasloopmanager.FlowCard.<anonymous> (BillingScreen.kt:1010)");
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
            ComposerKt.sourceInformationMarkerStart($composer, 1259129788, "C1016@64395L356,1025@64764L284:BillingScreen.kt#7ez3px");
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
            ComposerKt.sourceInformationMarkerStart($composer, -611467776, "C1023@64670L67:BillingScreen.kt#7ez3px");
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
            ComposerKt.sourceInformationMarkerStart($composer, 1420084510, "C1026@64789L80,1027@64886L29,1028@64932L102:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk($title, null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(3)), $composer, 6);
            TextKt.m3069TextNvy7gAk($subtext, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(10), null, null, null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 1, 0, null, null, $composer, 24576, 24960, 241642);
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
    public static final void TableCard(final TableItem table, final boolean isOccupied, final Double orderTotal, final int orderItemsCount, final Function0<Unit> function0, Composer $composer, final int $changed) {
        final TableItem tableItem;
        Double d;
        int i;
        Function0<Unit> function02;
        long m5129getTransparent0d7_KjU;
        Composer $composer2 = $composer.startRestartGroup(1938550065);
        ComposerKt.sourceInformation($composer2, "C(TableCard)N(table,isOccupied,orderTotal,orderItemsCount,onClick)1052@65666L37,1054@65760L2431,1046@65460L2731:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            tableItem = table;
            $dirty |= $composer2.changed(tableItem) ? 4 : 2;
        } else {
            tableItem = table;
        }
        if (($changed & 48) == 0) {
            $dirty |= $composer2.changed(isOccupied) ? 32 : 16;
        }
        if (($changed & 384) == 0) {
            d = orderTotal;
            $dirty |= $composer2.changed(d) ? 256 : 128;
        } else {
            d = orderTotal;
        }
        if (($changed & 3072) == 0) {
            i = orderItemsCount;
            $dirty |= $composer2.changed(i) ? 2048 : 1024;
        } else {
            i = orderItemsCount;
        }
        if (($changed & 24576) == 0) {
            function02 = function0;
            $dirty |= $composer2.changedInstance(function02) ? 16384 : 8192;
        } else {
            function02 = function0;
        }
        if ($composer2.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1938550065, $dirty, -1, "com.example.sasloopmanager.TableCard (BillingScreen.kt:1042)");
            }
            long borderColor = isOccupied ? ColorKt.getStatusWarning() : ColorKt.getCardBorderDark();
            if (isOccupied) {
                m5129getTransparent0d7_KjU = Color.m5092copywmQWz5c(r15, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r15) : 0.08f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r15) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r15) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getStatusWarning()) : 0.0f);
            } else {
                m5129getTransparent0d7_KjU = Color.INSTANCE.m5129getTransparent0d7_KjU();
            }
            final long bgTint = m5129getTransparent0d7_KjU;
            CardColors m2141cardColorsro_MJ88 = CardDefaults.INSTANCE.m2141cardColorsro_MJ88(ColorKt.getCardDark(), 0L, 0L, 0L, $composer2, CardDefaults.$stable << 12, 14);
            $composer2 = $composer2;
            final int $dirty2 = i;
            final Double d2 = d;
            CardKt.Card(ClickableKt.m297clickableoSLSa3U$default(SizeKt.m848height3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(105)), false, null, null, null, function02, 15, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(16)), m2141cardColorsro_MJ88, null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), borderColor), ComposableLambdaKt.rememberComposableLambda(-1440312065, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda10
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.TableCard$lambda$0(bgTint, isOccupied, d2, tableItem, $dirty2, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer2, 54), $composer2, ProfileVerifier.CompilationStatus.RESULT_CODE_ERROR_CANT_WRITE_PROFILE_VERIFICATION_RESULT_CACHE_FILE, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        } else {
            $composer2.skipToGroupEnd();
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda11
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.TableCard$lambda$1(TableItem.this, isOccupied, orderTotal, orderItemsCount, function0, $changed, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    public static final Unit TableCard$lambda$0(long $bgTint, final boolean $isOccupied, Double $orderTotal, TableItem $table, int $orderItemsCount, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Function0 function03;
        long inputDark;
        Function0 function04;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1055@65770L2415:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-1440312065, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous> (BillingScreen.kt:1055)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(BackgroundKt.m262backgroundbw27NRU$default(SizeKt.fillMaxSize$default(Modifier.INSTANCE, 0.0f, 1, null), $bgTint, null, 2, null), Dp.m7902constructorimpl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1042775818, "CC(Box)N(modifier,contentAlignment,propagateMinConstraints,content)71@3424L131:Box.kt#2w3rfo");
            MeasurePolicy maybeCachedBoxMeasurePolicy = BoxKt.maybeCachedBoxMeasurePolicy(Alignment.INSTANCE.getTopStart(), false);
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier = ComposedModifierKt.materializeModifier($composer, m816padding3ABfNKs);
            Function0 constructor = ComposeUiNode.INSTANCE.getConstructor();
            int i = ((((0 << 3) & 112) << 6) & 896) | 6;
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
            int i3 = ((0 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -441886139, "C1061@65930L2245:BillingScreen.kt#7ez3px");
            Modifier fillMaxSize$default = SizeKt.fillMaxSize$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Vertical spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(spaceBetween, Alignment.INSTANCE.getStart(), $composer, ((54 >> 3) & 14) | ((54 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, fillMaxSize$default);
            Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
            int i4 = ((((54 << 3) & 112) << 6) & 896) | 6;
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
            Updater.m4372setimpl(m4364constructorimpl2, columnMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            ColumnScopeInstance columnScopeInstance = ColumnScopeInstance.INSTANCE;
            int i6 = ((54 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -168995613, "C1065@66084L1118:BillingScreen.kt#7ez3px");
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Horizontal spaceBetween2 = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween2, centerVertically, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default);
            Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
            int i7 = ((((438 << 3) & 112) << 6) & 896) | 6;
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
            Updater.m4372setimpl(m4364constructorimpl3, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
            int i8 = (i7 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i9 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1751346266, "C1070@66322L216,1080@66747L437,1077@66560L624:BillingScreen.kt#7ez3px");
            TextKt.m3069TextNvy7gAk($table.getTableName(), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(15), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
            RoundedCornerShape m1124RoundedCornerShape0680j_4 = RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(6));
            if ($isOccupied) {
                inputDark = Color.m5092copywmQWz5c(r96, (r12 & 1) != 0 ? Color.m5096getAlphaimpl(r96) : 0.15f, (r12 & 2) != 0 ? Color.m5100getRedimpl(r96) : 0.0f, (r12 & 4) != 0 ? Color.m5099getGreenimpl(r96) : 0.0f, (r12 & 8) != 0 ? Color.m5097getBlueimpl(ColorKt.getStatusWarning()) : 0.0f);
            } else {
                inputDark = ColorKt.getInputDark();
            }
            SurfaceKt.m2926SurfaceT9BRK9s(null, m1124RoundedCornerShape0680j_4, inputDark, 0L, 0.0f, 0.0f, null, ComposableLambdaKt.rememberComposableLambda(180027940, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda15
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    Unit TableCard$lambda$0$0$0$0$0;
                    TableCard$lambda$0$0$0$0$0 = BillingScreenKt.TableCard$lambda$0$0$0$0$0($isOccupied, (Composer) obj, ((Integer) obj2).intValue());
                    return TableCard$lambda$0$0$0$0$0;
                }
            }, $composer, 54), $composer, 12582912, 121);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            if (!$isOccupied || $orderTotal == null) {
                $composer.startReplaceGroup(-167291358);
                ComposerKt.sourceInformation($composer, "1106@67858L285");
                String departmentName = $table.getDepartmentName();
                if (departmentName == null) {
                    departmentName = "General Section";
                }
                TextKt.m3069TextNvy7gAk(departmentName, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 1, 0, null, null, $composer, 24576, 24960, 241642);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-167877661);
                ComposerKt.sourceInformation($composer, "1092@67280L532");
                ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
                Modifier modifier = Modifier.INSTANCE;
                MeasurePolicy columnMeasurePolicy2 = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer, ((0 >> 3) & 14) | ((0 >> 3) & 112));
                ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
                Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier);
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
                Updater.m4372setimpl(m4364constructorimpl4, columnMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                Updater.m4372setimpl(m4364constructorimpl4, currentCompositionLocalMap4, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                Updater.m4368initimpl(m4364constructorimpl4, Integer.valueOf(hashCode4), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                Updater.m4370reconcileimpl(m4364constructorimpl4, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                Updater.m4372setimpl(m4364constructorimpl4, materializeModifier4, ComposeUiNode.INSTANCE.getSetModifier());
                int i11 = (i10 >> 6) & 14;
                ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
                ColumnScopeInstance columnScopeInstance2 = ColumnScopeInstance.INSTANCE;
                int i12 = ((0 >> 6) & 112) | 6;
                ComposerKt.sourceInformationMarkerStart($composer, -667860620, "C1093@67313L190,1098@67528L262:BillingScreen.kt#7ez3px");
                TextKt.m3069TextNvy7gAk($orderItemsCount + " item(s)", null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(11), null, null, null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 24576, 0, 262122);
                StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                String format = String.format("%.2f", Arrays.copyOf(new Object[]{$orderTotal}, 1));
                Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                TextKt.m3069TextNvy7gAk("₹ " + format, null, ColorKt.getStatusWarning(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endNode();
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                ComposerKt.sourceInformationMarkerEnd($composer);
                $composer.endReplaceGroup();
            }
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
    public static final Unit TableCard$lambda$0$0$0$0$0(boolean $isOccupied, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C1081@66773L389:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(180027940, $changed, -1, "com.example.sasloopmanager.TableCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1081)");
            }
            TextKt.m3069TextNvy7gAk($isOccupied ? "OCCUPIED" : "VACANT", PaddingKt.m817paddingVpY3zN4(Modifier.INSTANCE, Dp.m7902constructorimpl(6), Dp.m7902constructorimpl(3)), $isOccupied ? ColorKt.getStatusWarning() : ColorKt.getTextSecondary(), null, TextUnitKt.getSp(8), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597488, 0, 262056);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final void MenuItemCard(final MenuItem item, final int qtyInCart, final int punchedQty, final Function0<Unit> function0, final Function0<Unit> function02, Composer $composer, final int $changed) {
        MenuItem menuItem;
        int i;
        int i2;
        Function0<Unit> function03;
        Composer $composer2;
        Composer $composer3 = $composer.startRestartGroup(1778262002);
        ComposerKt.sourceInformation($composer3, "C(MenuItemCard)N(item,qtyInCart,punchedQty,onAdd,onRemove)1131@68555L37,1133@68652L4962,1128@68432L5182:BillingScreen.kt#7ez3px");
        int $dirty = $changed;
        if (($changed & 6) == 0) {
            menuItem = item;
            $dirty |= $composer3.changed(menuItem) ? 4 : 2;
        } else {
            menuItem = item;
        }
        if (($changed & 48) == 0) {
            i = qtyInCart;
            $dirty |= $composer3.changed(i) ? 32 : 16;
        } else {
            i = qtyInCart;
        }
        if (($changed & 384) == 0) {
            i2 = punchedQty;
            $dirty |= $composer3.changed(i2) ? 256 : 128;
        } else {
            i2 = punchedQty;
        }
        if (($changed & 3072) == 0) {
            function03 = function0;
            $dirty |= $composer3.changedInstance(function03) ? 2048 : 1024;
        } else {
            function03 = function0;
        }
        if (($changed & 24576) == 0) {
            $dirty |= $composer3.changedInstance(function02) ? 16384 : 8192;
        }
        if (!$composer3.shouldExecute(($dirty & 9363) != 9362, $dirty & 1)) {
            $composer2 = $composer3;
            $composer2.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(1778262002, $dirty, -1, "com.example.sasloopmanager.MenuItemCard (BillingScreen.kt:1127)");
            }
            $composer2 = $composer3;
            final MenuItem menuItem2 = menuItem;
            final int i3 = i;
            final int i4 = i2;
            final Function0<Unit> function04 = function03;
            CardKt.Card(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(12)), CardDefaults.INSTANCE.m2141cardColorsro_MJ88(ColorKt.getCardDark(), 0L, 0L, 0L, $composer2, CardDefaults.$stable << 12, 14), null, BorderStrokeKt.m288BorderStrokecXLIe8U(Dp.m7902constructorimpl(1), ColorKt.getCardBorderDark()), ComposableLambdaKt.rememberComposableLambda(112751076, true, new Function3() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda16
                @Override // kotlin.jvm.functions.Function3
                public final Object invoke(Object obj, Object obj2, Object obj3) {
                    return BillingScreenKt.MenuItemCard$lambda$0(MenuItem.this, i3, function04, i4, function02, (ColumnScope) obj, (Composer) obj2, ((Integer) obj3).intValue());
                }
            }, $composer2, 54), $composer2, 196614, 8);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda17
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.MenuItemCard$lambda$1(MenuItem.this, qtyInCart, punchedQty, function0, function02, $changed, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }

    /* JADX DEBUG: Don't trust debug lines info. Repeating lines: [1182=5, 1190=4, 1248=4] */
    /* JADX INFO: Access modifiers changed from: package-private */
    /* JADX WARN: Code restructure failed: missing block: B:37:0x034a, code lost:
    
        if (r4 == null) goto L47;
     */
    /* JADX WARN: Code restructure failed: missing block: B:70:0x07e2, code lost:
    
        if (r8 != androidx.compose.runtime.Composer.INSTANCE.getEmpty()) goto L92;
     */
    /* JADX WARN: Removed duplicated region for block: B:29:0x02cb  */
    /* JADX WARN: Removed duplicated region for block: B:36:0x033f  */
    /* JADX WARN: Removed duplicated region for block: B:40:0x0425  */
    /* JADX WARN: Removed duplicated region for block: B:44:0x0437  */
    /* JADX WARN: Removed duplicated region for block: B:46:0x0495  */
    /* JADX WARN: Removed duplicated region for block: B:49:0x0562  */
    /* JADX WARN: Removed duplicated region for block: B:52:0x056e  */
    /* JADX WARN: Removed duplicated region for block: B:55:0x0655  */
    /* JADX WARN: Removed duplicated region for block: B:75:0x0959  */
    /* JADX WARN: Removed duplicated region for block: B:83:0x08aa  */
    /* JADX WARN: Removed duplicated region for block: B:84:0x0574  */
    /* JADX WARN: Removed duplicated region for block: B:85:0x04b8  */
    /* JADX WARN: Removed duplicated region for block: B:86:0x0442  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
    */
    public static final Unit MenuItemCard$lambda$0(MenuItem $item, final int $qtyInCart, Function0 $onAdd, final int $punchedQty, final Function0 $onRemove, ColumnScope Card, Composer $composer, int $changed) {
        Function0 function0;
        Function0 function02;
        Composer composer;
        Composer composer2;
        boolean z;
        long statusDanger;
        String category;
        String str;
        String str2;
        Unit unit;
        Function0 function03;
        Composer composer3;
        Function0 function04;
        Intrinsics.checkNotNullParameter(Card, "$this$Card");
        ComposerKt.sourceInformation($composer, "C1134@68662L4946:BillingScreen.kt#7ez3px");
        if ($composer.shouldExecute(($changed & 17) != 16, $changed & 1)) {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(112751076, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous> (BillingScreen.kt:1134)");
            }
            Modifier m816padding3ABfNKs = PaddingKt.m816padding3ABfNKs(SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null), Dp.m7902constructorimpl(12));
            ComposerKt.sourceInformationMarkerStart($composer, 1341605231, "CC(Column)N(modifier,verticalArrangement,horizontalAlignment,content)87@4443L61,88@4509L134:Column.kt#2w3rfo");
            MeasurePolicy columnMeasurePolicy = ColumnKt.columnMeasurePolicy(Arrangement.INSTANCE.getTop(), Alignment.INSTANCE.getStart(), $composer, ((6 >> 3) & 14) | ((6 >> 3) & 112));
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
            ComposerKt.sourceInformationMarkerStart($composer, 2093002350, "C89@4557L9:Column.kt#2w3rfo");
            int i3 = ((6 >> 6) & 112) | 6;
            ColumnScope columnScope = ColumnScopeInstance.INSTANCE;
            ComposerKt.sourceInformationMarkerStart($composer, -352676843, "C1140@68842L971,1165@69827L29,1168@69895L318,1178@70227L29,1191@70654L29,1194@70754L2844:BillingScreen.kt#7ez3px");
            Alignment.Vertical centerVertically = Alignment.INSTANCE.getCenterVertically();
            Arrangement.Horizontal spaceBetween = Arrangement.INSTANCE.getSpaceBetween();
            Modifier fillMaxWidth$default = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy = RowKt.rowMeasurePolicy(spaceBetween, centerVertically, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode2 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap2 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier2 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default);
            Function0 constructor2 = ComposeUiNode.INSTANCE.getConstructor();
            int i4 = ((((438 << 3) & 112) << 6) & 896) | 6;
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
            Updater.m4372setimpl(m4364constructorimpl2, rowMeasurePolicy, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl2, currentCompositionLocalMap2, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl2, Integer.valueOf(hashCode2), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl2, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl2, materializeModifier2, ComposeUiNode.INSTANCE.getSetModifier());
            int i5 = (i4 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance = RowScopeInstance.INSTANCE;
            int i6 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, 2113638082, "C1145@69060L505,1157@69582L217:BillingScreen.kt#7ez3px");
            RoundedCornerShape circleShape = RoundedCornerShapeKt.getCircleShape();
            String subCategory = $item.getSubCategory();
            if (subCategory != null) {
                composer = $composer;
                String lowerCase = subCategory.toLowerCase(Locale.ROOT);
                Intrinsics.checkNotNullExpressionValue(lowerCase, "toLowerCase(...)");
                if (lowerCase != null) {
                    composer2 = $composer;
                    if (StringsKt.contains$default((CharSequence) lowerCase, (CharSequence) "non", false, 2, (Object) null)) {
                        z = true;
                        if (!z) {
                            String lowerCase2 = $item.getProductName().toLowerCase(Locale.ROOT);
                            Intrinsics.checkNotNullExpressionValue(lowerCase2, "toLowerCase(...)");
                            if (!StringsKt.contains$default((CharSequence) lowerCase2, (CharSequence) "chicken", false, 2, (Object) null)) {
                                String lowerCase3 = $item.getProductName().toLowerCase(Locale.ROOT);
                                Intrinsics.checkNotNullExpressionValue(lowerCase3, "toLowerCase(...)");
                                if (!StringsKt.contains$default((CharSequence) lowerCase3, (CharSequence) "mutton", false, 2, (Object) null)) {
                                    statusDanger = ColorKt.getSaSGreen();
                                    SurfaceKt.m2926SurfaceT9BRK9s(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), circleShape, statusDanger, 0L, 0.0f, 0.0f, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$2024773401$app(), composer, 12582918, MenuKt.InTransitionDuration);
                                    category = $item.getCategory();
                                    if (category != null) {
                                        str = category.toUpperCase(Locale.ROOT);
                                        Intrinsics.checkNotNullExpressionValue(str, "toUpperCase(...)");
                                    }
                                    str = "MAIN";
                                    Composer composer4 = composer;
                                    TextKt.m3069TextNvy7gAk(str, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer4, 1597440, 0, 262058);
                                    ComposerKt.sourceInformationMarkerEnd(composer4);
                                    ComposerKt.sourceInformationMarkerEnd($composer);
                                    $composer.endNode();
                                    ComposerKt.sourceInformationMarkerEnd($composer);
                                    ComposerKt.sourceInformationMarkerEnd($composer);
                                    ComposerKt.sourceInformationMarkerEnd($composer);
                                    SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
                                    TextKt.m3069TextNvy7gAk($item.getProductName(), columnScope.weight(Modifier.INSTANCE, 1.0f, false), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 2, 0, null, null, $composer, 1597824, 24960, 241576);
                                    SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(2)), $composer, 6);
                                    String description = $item.getDescription();
                                    str2 = (description != null || StringsKt.isBlank(description)) ? null : description;
                                    if (str2 == null) {
                                        $composer.startReplaceGroup(-351322331);
                                        $composer.endReplaceGroup();
                                        unit = null;
                                    } else {
                                        $composer.startReplaceGroup(-351322330);
                                        ComposerKt.sourceInformation($composer, "*1182@70370L222");
                                        TextKt.m3069TextNvy7gAk(str2, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(10), null, null, null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 1, 0, null, null, $composer, 24576, 24960, 241642);
                                        Unit unit2 = Unit.INSTANCE;
                                        $composer.endReplaceGroup();
                                        unit = Unit.INSTANCE;
                                    }
                                    if (unit == null) {
                                        $composer.startReplaceGroup(-1673892808);
                                        ComposerKt.sourceInformation($composer, "1189@70610L30");
                                        SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), $composer, 6);
                                        $composer.endReplaceGroup();
                                    } else {
                                        $composer.startReplaceGroup(-1673902356);
                                        $composer.endReplaceGroup();
                                    }
                                    SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
                                    Modifier fillMaxWidth$default2 = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                                    Arrangement.Horizontal spaceBetween2 = Arrangement.INSTANCE.getSpaceBetween();
                                    Alignment.Vertical centerVertically2 = Alignment.INSTANCE.getCenterVertically();
                                    ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                                    MeasurePolicy rowMeasurePolicy2 = RowKt.rowMeasurePolicy(spaceBetween2, centerVertically2, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
                                    ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                                    int hashCode3 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                                    CompositionLocalMap currentCompositionLocalMap3 = $composer.getCurrentCompositionLocalMap();
                                    Modifier materializeModifier3 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default2);
                                    Function0 constructor3 = ComposeUiNode.INSTANCE.getConstructor();
                                    int i7 = ((((438 << 3) & 112) << 6) & 896) | 6;
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
                                    Updater.m4372setimpl(m4364constructorimpl3, rowMeasurePolicy2, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                                    Updater.m4372setimpl(m4364constructorimpl3, currentCompositionLocalMap3, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                                    Updater.m4368initimpl(m4364constructorimpl3, Integer.valueOf(hashCode3), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                                    Updater.m4370reconcileimpl(m4364constructorimpl3, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                                    Updater.m4372setimpl(m4364constructorimpl3, materializeModifier3, ComposeUiNode.INSTANCE.getSetModifier());
                                    int i8 = (i7 >> 6) & 14;
                                    ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                                    RowScopeInstance rowScopeInstance2 = RowScopeInstance.INSTANCE;
                                    int i9 = ((438 >> 6) & 112) | 6;
                                    ComposerKt.sourceInformationMarkerStart($composer, -1972533510, "C1199@70972L218:BillingScreen.kt#7ez3px");
                                    StringCompanionObject stringCompanionObject = StringCompanionObject.INSTANCE;
                                    String format = String.format("%.0f", Arrays.copyOf(new Object[]{Double.valueOf($item.getPrice())}, 1));
                                    Intrinsics.checkNotNullExpressionValue(format, "format(...)");
                                    TextKt.m3069TextNvy7gAk("₹ " + format, null, ColorKt.getSaSGreen(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
                                    if ($qtyInCart > 0) {
                                        $composer.startReplaceGroup(-1972284705);
                                        ComposerKt.sourceInformation($composer, "1207@71249L1774");
                                        Alignment.Vertical centerVertically3 = Alignment.INSTANCE.getCenterVertically();
                                        Arrangement.Horizontal m686spacedBy0680j_4 = Arrangement.INSTANCE.m686spacedBy0680j_4(Dp.m7902constructorimpl(8));
                                        ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                                        Modifier modifier = Modifier.INSTANCE;
                                        MeasurePolicy rowMeasurePolicy3 = RowKt.rowMeasurePolicy(m686spacedBy0680j_4, centerVertically3, $composer, ((432 >> 3) & 14) | ((432 >> 3) & 112));
                                        ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                                        int hashCode4 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                                        CompositionLocalMap currentCompositionLocalMap4 = $composer.getCurrentCompositionLocalMap();
                                        Modifier materializeModifier4 = ComposedModifierKt.materializeModifier($composer, modifier);
                                        Function0 constructor4 = ComposeUiNode.INSTANCE.getConstructor();
                                        int i10 = ((((432 << 3) & 112) << 6) & 896) | 6;
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
                                        Updater.m4372setimpl(m4364constructorimpl4, rowMeasurePolicy3, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                                        Updater.m4372setimpl(m4364constructorimpl4, currentCompositionLocalMap4, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                                        Updater.m4368initimpl(m4364constructorimpl4, Integer.valueOf(hashCode4), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                                        Updater.m4370reconcileimpl(m4364constructorimpl4, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                                        Updater.m4372setimpl(m4364constructorimpl4, materializeModifier4, ComposeUiNode.INSTANCE.getSetModifier());
                                        int i11 = (i10 >> 6) & 14;
                                        ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                                        RowScopeInstance rowScopeInstance3 = RowScopeInstance.INSTANCE;
                                        int i12 = ((432 >> 6) & 112) | 6;
                                        ComposerKt.sourceInformationMarkerStart($composer, -665802369, "C1212@71499L42,1220@71949L389,1211@71449L889,1227@72363L232,1233@72620L381:BillingScreen.kt#7ez3px");
                                        boolean z2 = $qtyInCart > $punchedQty;
                                        Modifier m261backgroundbw27NRU = BackgroundKt.m261backgroundbw27NRU(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(26)), $qtyInCart > $punchedQty ? ColorKt.getInputDark() : Color.INSTANCE.m5129getTransparent0d7_KjU(), RoundedCornerShapeKt.getCircleShape());
                                        ComposerKt.sourceInformationMarkerStart($composer, -160024738, "CC(remember):BillingScreen.kt#9igjgp");
                                        boolean changed = $composer.changed($qtyInCart) | $composer.changed($punchedQty) | $composer.changed($onRemove);
                                        Object rememberedValue = $composer.rememberedValue();
                                        if (changed) {
                                        }
                                        Object obj = new Function0() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda0
                                            @Override // kotlin.jvm.functions.Function0
                                            public final Object invoke() {
                                                Unit MenuItemCard$lambda$0$0$3$0$0$0;
                                                MenuItemCard$lambda$0$0$3$0$0$0 = BillingScreenKt.MenuItemCard$lambda$0$0$3$0$0$0($qtyInCart, $punchedQty, $onRemove);
                                                return MenuItemCard$lambda$0$0$3$0$0$0;
                                            }
                                        };
                                        $composer.updateRememberedValue(obj);
                                        rememberedValue = obj;
                                        ComposerKt.sourceInformationMarkerEnd($composer);
                                        IconButtonKt.IconButton((Function0) rememberedValue, m261backgroundbw27NRU, z2, null, null, null, ComposableLambdaKt.rememberComposableLambda(-132533294, true, new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda1
                                            @Override // kotlin.jvm.functions.Function2
                                            public final Object invoke(Object obj2, Object obj3) {
                                                Unit MenuItemCard$lambda$0$0$3$0$1;
                                                MenuItemCard$lambda$0$0$3$0$1 = BillingScreenKt.MenuItemCard$lambda$0$0$3$0$1($qtyInCart, $punchedQty, (Composer) obj2, ((Integer) obj3).intValue());
                                                return MenuItemCard$lambda$0$0$3$0$1;
                                            }
                                        }, $composer, 54), $composer, 1572864, 56);
                                        TextKt.m3069TextNvy7gAk(String.valueOf($qtyInCart), null, Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597824, 0, 262058);
                                        IconButtonKt.IconButton($onAdd, BackgroundKt.m261backgroundbw27NRU(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(26)), ColorKt.getSaSGreen(), RoundedCornerShapeKt.getCircleShape()), false, null, null, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$433651081$app(), $composer, 1572864, 60);
                                        ComposerKt.sourceInformationMarkerEnd($composer);
                                        ComposerKt.sourceInformationMarkerEnd($composer);
                                        $composer.endNode();
                                        ComposerKt.sourceInformationMarkerEnd($composer);
                                        ComposerKt.sourceInformationMarkerEnd($composer);
                                        ComposerKt.sourceInformationMarkerEnd($composer);
                                        $composer.endReplaceGroup();
                                        composer3 = $composer;
                                    } else {
                                        $composer.startReplaceGroup(-1970518852);
                                        ComposerKt.sourceInformation($composer, "1245@73166L39,1243@73069L497");
                                        composer3 = $composer;
                                        ButtonKt.Button($onAdd, SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(26)), false, RoundedCornerShapeKt.m1124RoundedCornerShape0680j_4(Dp.m7902constructorimpl(6)), ButtonDefaults.INSTANCE.m2121buttonColorsro_MJ88(ColorKt.getSaSGreen(), 0L, 0L, 0L, $composer, ButtonDefaults.$stable << 12, 14), null, null, PaddingKt.m810PaddingValuesYgX7TsA(Dp.m7902constructorimpl(10), Dp.m7902constructorimpl(2)), null, ComposableSingletons$BillingScreenKt.INSTANCE.m8426getLambda$1542752375$app(), composer3, 817889328, 356);
                                        composer3.endReplaceGroup();
                                    }
                                    ComposerKt.sourceInformationMarkerEnd(composer3);
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
                                    ComposerKt.sourceInformationMarkerEnd(composer2);
                                    if (ComposerKt.isTraceInProgress()) {
                                        ComposerKt.traceEventEnd();
                                    }
                                }
                            }
                        }
                        statusDanger = ColorKt.getStatusDanger();
                        SurfaceKt.m2926SurfaceT9BRK9s(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), circleShape, statusDanger, 0L, 0.0f, 0.0f, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$2024773401$app(), composer, 12582918, MenuKt.InTransitionDuration);
                        category = $item.getCategory();
                        if (category != null) {
                        }
                        str = "MAIN";
                        Composer composer42 = composer;
                        TextKt.m3069TextNvy7gAk(str, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer42, 1597440, 0, 262058);
                        ComposerKt.sourceInformationMarkerEnd(composer42);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        $composer.endNode();
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        ComposerKt.sourceInformationMarkerEnd($composer);
                        SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
                        TextKt.m3069TextNvy7gAk($item.getProductName(), columnScope.weight(Modifier.INSTANCE, 1.0f, false), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 2, 0, null, null, $composer, 1597824, 24960, 241576);
                        SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(2)), $composer, 6);
                        String description2 = $item.getDescription();
                        if (description2 != null) {
                        }
                        if (str2 == null) {
                        }
                        if (unit == null) {
                        }
                        SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
                        Modifier fillMaxWidth$default22 = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
                        Arrangement.Horizontal spaceBetween22 = Arrangement.INSTANCE.getSpaceBetween();
                        Alignment.Vertical centerVertically22 = Alignment.INSTANCE.getCenterVertically();
                        ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
                        MeasurePolicy rowMeasurePolicy22 = RowKt.rowMeasurePolicy(spaceBetween22, centerVertically22, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
                        ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
                        int hashCode32 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
                        CompositionLocalMap currentCompositionLocalMap32 = $composer.getCurrentCompositionLocalMap();
                        Modifier materializeModifier32 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default22);
                        Function0 constructor32 = ComposeUiNode.INSTANCE.getConstructor();
                        int i72 = ((((438 << 3) & 112) << 6) & 896) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
                        if (!($composer.getApplier() instanceof Applier)) {
                        }
                        $composer.startReusableNode();
                        if ($composer.getInserting()) {
                        }
                        Composer m4364constructorimpl32 = Updater.m4364constructorimpl($composer);
                        Updater.m4372setimpl(m4364constructorimpl32, rowMeasurePolicy22, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
                        Updater.m4372setimpl(m4364constructorimpl32, currentCompositionLocalMap32, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
                        Updater.m4368initimpl(m4364constructorimpl32, Integer.valueOf(hashCode32), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
                        Updater.m4370reconcileimpl(m4364constructorimpl32, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
                        Updater.m4372setimpl(m4364constructorimpl32, materializeModifier32, ComposeUiNode.INSTANCE.getSetModifier());
                        int i82 = (i72 >> 6) & 14;
                        ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
                        RowScopeInstance rowScopeInstance22 = RowScopeInstance.INSTANCE;
                        int i92 = ((438 >> 6) & 112) | 6;
                        ComposerKt.sourceInformationMarkerStart($composer, -1972533510, "C1199@70972L218:BillingScreen.kt#7ez3px");
                        StringCompanionObject stringCompanionObject2 = StringCompanionObject.INSTANCE;
                        String format2 = String.format("%.0f", Arrays.copyOf(new Object[]{Double.valueOf($item.getPrice())}, 1));
                        Intrinsics.checkNotNullExpressionValue(format2, "format(...)");
                        TextKt.m3069TextNvy7gAk("₹ " + format2, null, ColorKt.getSaSGreen(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
                        if ($qtyInCart > 0) {
                        }
                        ComposerKt.sourceInformationMarkerEnd(composer3);
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
                        ComposerKt.sourceInformationMarkerEnd(composer2);
                        if (ComposerKt.isTraceInProgress()) {
                        }
                    }
                } else {
                    composer2 = $composer;
                }
            } else {
                composer = $composer;
                composer2 = $composer;
            }
            z = false;
            if (!z) {
            }
            statusDanger = ColorKt.getStatusDanger();
            SurfaceKt.m2926SurfaceT9BRK9s(SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), circleShape, statusDanger, 0L, 0.0f, 0.0f, null, ComposableSingletons$BillingScreenKt.INSTANCE.getLambda$2024773401$app(), composer, 12582918, MenuKt.InTransitionDuration);
            category = $item.getCategory();
            if (category != null) {
            }
            str = "MAIN";
            Composer composer422 = composer;
            TextKt.m3069TextNvy7gAk(str, null, ColorKt.getTextSecondary(), null, TextUnitKt.getSp(9), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, composer422, 1597440, 0, 262058);
            ComposerKt.sourceInformationMarkerEnd(composer422);
            ComposerKt.sourceInformationMarkerEnd($composer);
            $composer.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            ComposerKt.sourceInformationMarkerEnd($composer);
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
            TextKt.m3069TextNvy7gAk($item.getProductName(), columnScope.weight(Modifier.INSTANCE, 1.0f, false), Color.INSTANCE.m5131getWhite0d7_KjU(), null, TextUnitKt.getSp(13), null, FontWeight.INSTANCE.getBold(), null, 0L, null, null, 0L, TextOverflow.INSTANCE.m7813getEllipsisgIe3tQ8(), false, 2, 0, null, null, $composer, 1597824, 24960, 241576);
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(2)), $composer, 6);
            String description22 = $item.getDescription();
            if (description22 != null) {
            }
            if (str2 == null) {
            }
            if (unit == null) {
            }
            SpacerKt.Spacer(SizeKt.m848height3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(8)), $composer, 6);
            Modifier fillMaxWidth$default222 = SizeKt.fillMaxWidth$default(Modifier.INSTANCE, 0.0f, 1, null);
            Arrangement.Horizontal spaceBetween222 = Arrangement.INSTANCE.getSpaceBetween();
            Alignment.Vertical centerVertically222 = Alignment.INSTANCE.getCenterVertically();
            ComposerKt.sourceInformationMarkerStart($composer, 844473419, "CC(Row)N(modifier,horizontalArrangement,verticalAlignment,content)99@5125L58,100@5188L131:Row.kt#2w3rfo");
            MeasurePolicy rowMeasurePolicy222 = RowKt.rowMeasurePolicy(spaceBetween222, centerVertically222, $composer, ((438 >> 3) & 14) | ((438 >> 3) & 112));
            ComposerKt.sourceInformationMarkerStart($composer, -1159599143, "CC(Layout)P(!1,2)81@3355L27,84@3521L416:Layout.kt#80mrfh");
            int hashCode322 = Long.hashCode(ComposablesKt.getCurrentCompositeKeyHashCode($composer, 0));
            CompositionLocalMap currentCompositionLocalMap322 = $composer.getCurrentCompositionLocalMap();
            Modifier materializeModifier322 = ComposedModifierKt.materializeModifier($composer, fillMaxWidth$default222);
            Function0 constructor322 = ComposeUiNode.INSTANCE.getConstructor();
            int i722 = ((((438 << 3) & 112) << 6) & 896) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -553112988, "CC(ReusableComposeNode)N(factory,update,content)399@15590L9:Composables.kt#9igjgp");
            if (!($composer.getApplier() instanceof Applier)) {
            }
            $composer.startReusableNode();
            if ($composer.getInserting()) {
            }
            Composer m4364constructorimpl322 = Updater.m4364constructorimpl($composer);
            Updater.m4372setimpl(m4364constructorimpl322, rowMeasurePolicy222, ComposeUiNode.INSTANCE.getSetMeasurePolicy());
            Updater.m4372setimpl(m4364constructorimpl322, currentCompositionLocalMap322, ComposeUiNode.INSTANCE.getSetResolvedCompositionLocals());
            Updater.m4368initimpl(m4364constructorimpl322, Integer.valueOf(hashCode322), ComposeUiNode.INSTANCE.getSetCompositeKeyHash());
            Updater.m4370reconcileimpl(m4364constructorimpl322, ComposeUiNode.INSTANCE.getApplyOnDeactivatedNodeAssertion());
            Updater.m4372setimpl(m4364constructorimpl322, materializeModifier322, ComposeUiNode.INSTANCE.getSetModifier());
            int i822 = (i722 >> 6) & 14;
            ComposerKt.sourceInformationMarkerStart($composer, 1456264949, "C101@5233L9:Row.kt#2w3rfo");
            RowScopeInstance rowScopeInstance222 = RowScopeInstance.INSTANCE;
            int i922 = ((438 >> 6) & 112) | 6;
            ComposerKt.sourceInformationMarkerStart($composer, -1972533510, "C1199@70972L218:BillingScreen.kt#7ez3px");
            StringCompanionObject stringCompanionObject22 = StringCompanionObject.INSTANCE;
            String format22 = String.format("%.0f", Arrays.copyOf(new Object[]{Double.valueOf($item.getPrice())}, 1));
            Intrinsics.checkNotNullExpressionValue(format22, "format(...)");
            TextKt.m3069TextNvy7gAk("₹ " + format22, null, ColorKt.getSaSGreen(), null, TextUnitKt.getSp(14), null, FontWeight.INSTANCE.getBlack(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer, 1597440, 0, 262058);
            if ($qtyInCart > 0) {
            }
            ComposerKt.sourceInformationMarkerEnd(composer3);
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
            ComposerKt.sourceInformationMarkerEnd(composer2);
            if (ComposerKt.isTraceInProgress()) {
            }
        } else {
            $composer.skipToGroupEnd();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$0$0$3$0$0$0(int $qtyInCart, int $punchedQty, Function0 $onRemove) {
        if ($qtyInCart > $punchedQty) {
            $onRemove.invoke();
        }
        return Unit.INSTANCE;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static final Unit MenuItemCard$lambda$0$0$3$0$1(int $qtyInCart, int $punchedQty, Composer $composer, int $changed) {
        ComposerKt.sourceInformation($composer, "C:BillingScreen.kt#7ez3px");
        if (!$composer.shouldExecute(($changed & 3) != 2, $changed & 1)) {
            $composer.skipToGroupEnd();
        } else {
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(-132533294, $changed, -1, "com.example.sasloopmanager.MenuItemCard.<anonymous>.<anonymous>.<anonymous>.<anonymous>.<anonymous> (BillingScreen.kt:1221)");
            }
            if ($qtyInCart == $punchedQty) {
                $composer.startReplaceGroup(-1224321637);
                ComposerKt.sourceInformation($composer, "1222@72042L85");
                IconKt.m2517Iconww6aTOc(LockKt.getLock(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(12)), ColorKt.getTextSecondary(), $composer, 432, 0);
                $composer.endReplaceGroup();
            } else {
                $composer.startReplaceGroup(-1224167877);
                ComposerKt.sourceInformation($composer, "1224@72197L85");
                IconKt.m2517Iconww6aTOc(RemoveKt.getRemove(Icons.INSTANCE.getDefault()), (String) null, SizeKt.m862size3ABfNKs(Modifier.INSTANCE, Dp.m7902constructorimpl(14)), Color.INSTANCE.m5131getWhite0d7_KjU(), $composer, 3504, 0);
                $composer.endReplaceGroup();
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
        }
        return Unit.INSTANCE;
    }

    /* renamed from: ReceiptRow-6jM-SoI, reason: not valid java name */
    private static final void m8420ReceiptRow6jMSoI(final String label, final String value, boolean isBold, long color, long fontSize, Composer $composer, final int $changed, final int i) {
        String str;
        boolean z;
        long color2;
        long j;
        final boolean isBold2;
        final long color3;
        final long fontSize2;
        long fontSize3;
        int i2;
        Function0 function0;
        Composer $composer2 = $composer.startRestartGroup(1071795232);
        ComposerKt.sourceInformation($composer2, "C(ReceiptRow)N(label,value,isBold,color:c#ui.graphics.Color,fontSize:c#ui.unit.TextUnit)1266@73817L583:BillingScreen.kt#7ez3px");
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
                isBold2 = false;
            } else {
                isBold2 = z;
            }
            if (i4 != 0) {
                color2 = Color.INSTANCE.m5131getWhite0d7_KjU();
            }
            if (i5 == 0) {
                fontSize3 = j;
                i2 = 1071795232;
            } else {
                fontSize3 = TextUnitKt.getSp(12);
                i2 = 1071795232;
            }
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventStart(i2, $dirty, -1, "com.example.sasloopmanager.ReceiptRow (BillingScreen.kt:1265)");
            }
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
            ComposerKt.sourceInformationMarkerStart($composer2, -1745756656, "C1271@73995L214,1277@74218L176:BillingScreen.kt#7ez3px");
            long textPrimary = isBold2 ? ColorKt.getTextPrimary() : ColorKt.getTextSecondary();
            FontWeight.Companion companion = FontWeight.INSTANCE;
            TextKt.m3069TextNvy7gAk(str, null, textPrimary, null, fontSize3, null, isBold2 ? companion.getBold() : companion.getNormal(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, ($dirty2 & 14) | ($dirty2 & 57344), 0, 262058);
            FontWeight.Companion companion2 = FontWeight.INSTANCE;
            long color4 = color2;
            TextKt.m3069TextNvy7gAk(value, null, color4, null, fontSize3, null, isBold2 ? companion2.getBlack() : companion2.getBold(), null, 0L, null, null, 0L, 0, false, 0, 0, null, null, $composer2, (($dirty2 >> 3) & 14) | (($dirty2 >> 3) & 896) | ($dirty2 & 57344), 0, 262058);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            $composer2.endNode();
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            ComposerKt.sourceInformationMarkerEnd($composer2);
            if (ComposerKt.isTraceInProgress()) {
                ComposerKt.traceEventEnd();
            }
            color3 = color4;
            fontSize2 = fontSize3;
        } else {
            $composer2.skipToGroupEnd();
            isBold2 = z;
            color3 = color2;
            fontSize2 = j;
        }
        ScopeUpdateScope endRestartGroup = $composer2.endRestartGroup();
        if (endRestartGroup != null) {
            endRestartGroup.updateScope(new Function2() { // from class: com.example.sasloopmanager.BillingScreenKt$$ExternalSyntheticLambda20
                @Override // kotlin.jvm.functions.Function2
                public final Object invoke(Object obj, Object obj2) {
                    return BillingScreenKt.ReceiptRow_6jM_SoI$lambda$1(label, value, isBold2, color3, fontSize2, $changed, i, (Composer) obj, ((Integer) obj2).intValue());
                }
            });
        }
    }
}
